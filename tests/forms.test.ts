import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return path.endsWith(".tsx") ? [path] : [];
  });
}

function formTags() {
  return sourceFiles("app").flatMap((file) => {
    const source = readFileSync(file, "utf8");
    const tags = source.match(/<form\b[\s\S]*?\n\s*>\s*\n/g) ?? [];
    return tags.map((tag) => ({ file, tag }));
  });
}

describe("forms", () => {
  it("finds every form in the app", () => {
    expect(formTags().length).toBeGreaterThanOrEqual(6);
  });

  it("post instead of get, so input never ends up in the URL before JavaScript has loaded", () => {
    const withoutPost = formTags()
      .filter(({ tag }) => !/method="post"/.test(tag))
      .map(({ file }) => file);
    expect(withoutPost).toEqual([]);
  });
});
