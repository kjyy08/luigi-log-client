import test from "node:test";
import assert from "node:assert/strict";

import { buildHeadingId, extractMarkdownHeadings } from "./reading-navigation.ts";

test("builds stable heading ids and resolves collisions", () => {
    const usedIds = new Map();

    assert.equal(buildHeadingId("Intro: Code & UX", usedIds), "intro-code-ux");
    assert.equal(buildHeadingId("Intro Code UX", usedIds), "intro-code-ux-2");
    assert.equal(buildHeadingId("!!!", usedIds), "section");
    assert.equal(buildHeadingId("!!!", usedIds), "section-2");
});

test("extracts visible markdown headings while ignoring fenced code blocks", () => {
    const markdown = [
        "# Title",
        "",
        "## Setup",
        "```md",
        "## Not a heading",
        "```",
        "### Install",
        "## Setup",
    ].join("\n");

    assert.deepEqual(extractMarkdownHeadings(markdown), [
        { id: "title", level: 1, text: "Title" },
        { id: "setup", level: 2, text: "Setup" },
        { id: "install", level: 3, text: "Install" },
        { id: "setup-2", level: 2, text: "Setup" },
    ]);
});
