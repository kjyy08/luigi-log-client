import test from "node:test";
import assert from "node:assert/strict";

import {
    buildHeadingId,
    createMarkdownHeadingIdResolver,
    extractMarkdownHeadings,
    getActiveHeadingId,
    getVisibleTocHeadingIds,
} from "./reading-navigation.ts";

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
        { id: "title", level: 1, text: "Title", line: 1 },
        { id: "setup", level: 2, text: "Setup", line: 3 },
        { id: "install", level: 3, text: "Install", line: 7 },
        { id: "setup-2", level: 2, text: "Setup", line: 8 },
    ]);
});

test("extracts Korean, blank, and duplicate headings with stable ids", () => {
    const markdown = [
        "## 권한과 도구 제한",
        "###    ",
        "## 참고 자료",
        "## 권한과 도구 제한",
        "## !!!",
        "## !!!",
    ].join("\n");

    assert.deepEqual(extractMarkdownHeadings(markdown), [
        { id: "권한과-도구-제한", level: 2, text: "권한과 도구 제한", line: 1 },
        { id: "참고-자료", level: 2, text: "참고 자료", line: 3 },
        { id: "권한과-도구-제한-2", level: 2, text: "권한과 도구 제한", line: 4 },
        { id: "section", level: 2, text: "!!!", line: 5 },
        { id: "section-2", level: 2, text: "!!!", line: 6 },
    ]);
});

test("keeps the active heading on the clicked/current section instead of a lower visible heading", () => {
    const headings = [
        { id: "권한과-도구-제한", level: 2, text: "권한과 도구 제한" },
        { id: "참고-자료", level: 2, text: "참고 자료" },
    ];

    assert.equal(
        getActiveHeadingId(headings, [
            { id: "권한과-도구-제한", top: 96 },
            { id: "참고-자료", top: 620 },
        ]),
        "권한과-도구-제한",
    );
});

test("assigns heading ids by matching rendered level and text without drifting", () => {
    const headings = [
        { id: "2-권한과-도구-제한", level: 2, text: "2. 권한과 도구 제한" },
        { id: "참고-자료", level: 2, text: "참고 자료" },
    ];
    const resolveHeadingId = createMarkdownHeadingIdResolver(headings);

    assert.equal(resolveHeadingId(2, "2. 권한과 도구 제한"), "2-권한과-도구-제한");
    assert.equal(resolveHeadingId(3, "1. 컨텍스트"), undefined);
    assert.equal(resolveHeadingId(2, "참고 자료"), "참고-자료");
});

test("resolves rendered heading ids by source line without consuming ids during render probes", () => {
    const headings = [
        { id: "setup", level: 2, text: "Setup", line: 1 },
        { id: "setup-2", level: 2, text: "Setup", line: 3 },
    ];
    const resolveHeadingId = createMarkdownHeadingIdResolver(headings);

    assert.equal(resolveHeadingId(2, "Setup", 1), "setup");
    assert.equal(resolveHeadingId(2, "Setup", 1), "setup");
    assert.equal(resolveHeadingId(2, "Setup", 3), "setup-2");
});

test("keeps h2 headings visible while collapsing nested headings outside the active h2 section", () => {
    const headings = [
        { id: "overview", level: 2, text: "Overview" },
        { id: "context", level: 3, text: "Context" },
        { id: "details", level: 4, text: "Details" },
        { id: "api", level: 2, text: "API" },
        { id: "request", level: 3, text: "Request" },
        { id: "response", level: 4, text: "Response" },
    ];

    assert.deepEqual(getVisibleTocHeadingIds(headings, "context"), [
        "overview",
        "context",
        "details",
        "api",
    ]);
    assert.deepEqual(getVisibleTocHeadingIds(headings, "response"), [
        "overview",
        "api",
        "request",
        "response",
    ]);
});

test("shows active nested headings when a document starts without h2 headings", () => {
    const headings = [
        { id: "title", level: 1, text: "Title" },
        { id: "intro", level: 3, text: "Intro" },
        { id: "deep", level: 4, text: "Deep" },
    ];

    assert.deepEqual(getVisibleTocHeadingIds(headings, "deep"), ["title", "intro", "deep"]);
});
