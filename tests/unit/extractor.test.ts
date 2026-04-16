import { describe, expect, it, vi } from "vitest";

import { extractReadablePage } from "@/lib/extractor";

function createLookup(addresses: string[] | Record<string, string[]>) {
  return vi.fn(async (hostname: string) => {
    const values = Array.isArray(addresses) ? addresses : addresses[hostname] ?? [];

    return values.map((address) => ({
      address,
      family: address.includes(":") ? 6 : 4,
    }));
  });
}

describe("extractReadablePage", () => {
  it("extracts readable HTML content from a public page", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        `
          <html>
            <head><title>Fallback Title</title></head>
            <body>
              <article>
                <h1>Readable Title</h1>
                <p>Readable body content for the article.</p>
              </article>
            </body>
          </html>
        `,
        {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        },
      ),
    );

    const result = await extractReadablePage("https://example.com/article", {
      fetchImpl,
      lookup: createLookup(["93.184.216.34"]),
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://example.com/article",
      expect.objectContaining({
        redirect: "manual",
        headers: expect.objectContaining({
          accept: expect.stringMatching(/text\/html/i),
          "user-agent": expect.stringMatching(/site2markdown/i),
        }),
      }),
    );
    expect(result).toMatchObject({
      sourceUrl: "https://example.com/article",
      finalUrl: "https://example.com/article",
      title: "Fallback Title",
      contentHtml: expect.stringContaining("Readable body content"),
    });
  });

  it("rejects non-html responses", async () => {
    await expect(
      extractReadablePage("https://example.com/data", {
        fetchImpl: vi.fn().mockResolvedValue(
          new Response("{}", {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          }),
        ),
        lookup: createLookup(["93.184.216.34"]),
      }),
    ).rejects.toThrow(/html/i);
  });

  it("rejects private addresses discovered during DNS lookup before fetching", async () => {
    const fetchImpl = vi.fn();

    await expect(
      extractReadablePage("https://example.com/secret", {
        fetchImpl,
        lookup: createLookup(["127.0.0.1"]),
      }),
    ).rejects.toThrow(/public http|private network/i);

    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects redirects that resolve to private network addresses", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, {
          status: 302,
          headers: {
            location: "http://internal.example.local/admin",
          },
        }),
      )
      .mockResolvedValueOnce(
        new Response("should never happen", {
          status: 200,
          headers: {
            "content-type": "text/html",
          },
        }),
      );

    await expect(
      extractReadablePage("https://example.com/start", {
        fetchImpl,
        lookup: createLookup({
          "example.com": ["93.184.216.34"],
          "internal.example.local": ["10.0.0.5"],
        }),
      }),
    ).rejects.toThrow(/public http|private network/i);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("fails with a friendly timeout message", async () => {
    const fetchImpl = vi.fn((_input: string | URL | Request, init?: RequestInit) => {
      return new Promise((_, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("The operation was aborted.", "AbortError"));
        });
      });
    });

    await expect(
      extractReadablePage("https://example.com/slow", {
        fetchImpl: fetchImpl as typeof fetch,
        lookup: createLookup(["93.184.216.34"]),
        timeoutMs: 10,
      }),
    ).rejects.toThrow(/timed out/i);
  });

  it("rejects responses that exceed the configured size limit", async () => {
    await expect(
      extractReadablePage("https://example.com/large", {
        fetchImpl: vi.fn().mockResolvedValue(
          new Response("<html></html>", {
            status: 200,
            headers: {
              "content-type": "text/html",
              "content-length": "999999",
            },
          }),
        ),
        lookup: createLookup(["93.184.216.34"]),
        maxResponseBytes: 128,
      }),
    ).rejects.toThrow(/too large/i);
  });

  it("cancels the response reader when the streamed body exceeds the size limit", async () => {
    const cancel = vi.fn().mockResolvedValue(undefined);
    const releaseLock = vi.fn();
    const read = vi
      .fn()
      .mockResolvedValueOnce({
        done: false,
        value: new Uint8Array(256),
      })
      .mockResolvedValueOnce({
        done: true,
        value: undefined,
      });

    const oversizedResponse = {
      ok: true,
      status: 200,
      headers: new Headers({
        "content-type": "text/html",
      }),
      body: {
        getReader: () => ({
          read,
          cancel,
          releaseLock,
        }),
      },
      text: vi.fn(),
    } as unknown as Response;

    await expect(
      extractReadablePage("https://example.com/stream-large", {
        fetchImpl: vi.fn().mockResolvedValue(oversizedResponse),
        lookup: createLookup(["93.184.216.34"]),
        maxResponseBytes: 128,
      }),
    ).rejects.toThrow(/too large/i);

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(releaseLock).toHaveBeenCalledTimes(1);
  });

  it("fails clearly when readability cannot extract meaningful content", async () => {
    await expect(
      extractReadablePage("https://example.com/empty", {
        fetchImpl: vi.fn().mockResolvedValue(
          new Response("<html><body><div></div></body></html>", {
            status: 200,
            headers: {
              "content-type": "text/html",
            },
          }),
        ),
        lookup: createLookup(["93.184.216.34"]),
      }),
    ).rejects.toThrow(/meaningful readable content/i);
  });
});
