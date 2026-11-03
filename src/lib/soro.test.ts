import { describe, it, expect } from "vitest";
import { sanitizeArticleHtml } from "./soro";

describe("sanitizeArticleHtml", () => {
  it("keeps normal article markup unchanged", () => {
    const html =
      '<h2>Title</h2><h3>Sub</h3><p>Text with <strong>bold</strong> and <a href="https://www.baseballstatstracker.com/pricing">a link</a>.</p><ul><li>One</li></ul>';
    expect(sanitizeArticleHtml(html)).toBe(html);
  });
  it("removes script tags and their contents", () => {
    expect(sanitizeArticleHtml('<p>Hi</p><script>alert("x")</script>')).toBe("<p>Hi</p>");
  });
  it("removes inline event handlers", () => {
    expect(sanitizeArticleHtml('<p onclick="alert(1)">Hi</p>')).toBe("<p>Hi</p>");
    expect(sanitizeArticleHtml('<img src="https://a.com/x.png" onerror="alert(1)">')).toBe(
      '<img src="https://a.com/x.png" />',
    );
  });
  it("removes javascript: links but keeps the text", () => {
    expect(sanitizeArticleHtml('<a href="javascript:alert(1)">Click</a>')).toBe("<a>Click</a>");
  });
  it("removes iframes, styles and forms", () => {
    expect(
      sanitizeArticleHtml(
        '<iframe src="https://evil.example"></iframe><style>p{display:none}</style><form action="https://evil.example"><input name="password"></form><p>Hi</p>',
      ),
    ).toBe("<p>Hi</p>");
  });
});
