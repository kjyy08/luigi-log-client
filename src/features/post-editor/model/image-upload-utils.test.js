import test from "node:test";
import assert from "node:assert/strict";

import {
    createImageUploadPlaceholder,
    getImageUploadPublishBlockMessage,
    hasUnresolvedImageUploadPlaceholders,
    insertTextAtSelection,
    removeImageUploadPlaceholder,
    replaceImageUploadPlaceholder,
    validateImageFiles,
} from "./image-upload-utils.ts";

const makeFile = (name, type, size = 128) =>
    new File([new Uint8Array(size)], name, { type });

test("validates only supported image files up to 5MB", () => {
    const jpeg = makeFile("a.jpg", "image/jpeg");
    const png = makeFile("b.png", "image/png");
    const webp = makeFile("c.webp", "image/webp");
    const gif = makeFile("d.gif", "image/gif");
    const svg = makeFile("e.svg", "image/svg+xml");
    const tooLarge = makeFile("large.png", "image/png", 5 * 1024 * 1024 + 1);

    const result = validateImageFiles([jpeg, png, webp, gif, svg, tooLarge]);

    assert.deepEqual(result.validFiles.map((file) => file.name), ["a.jpg", "b.png", "c.webp", "d.gif"]);
    assert.deepEqual(result.rejectedFiles.map(({ file }) => file.name), ["e.svg", "large.png"]);
});

test("creates and inserts upload placeholders in user input order", () => {
    const first = createImageUploadPlaceholder("first.png", "upload-1");
    const second = createImageUploadPlaceholder("second.png", "upload-2");

    const result = insertTextAtSelection("hello world", `${first}\n${second}\n`, 6, 6);

    assert.equal(
        result,
        `hello ${first}\n${second}\nworld`,
    );
});

test("replaces only the matching upload placeholder", () => {
    const first = createImageUploadPlaceholder("first.png", "upload-1");
    const second = createImageUploadPlaceholder("second.png", "upload-2");
    const body = `${first}\n${second}`;

    const result = replaceImageUploadPlaceholder(body, "upload-2", "second.png", "https://cdn/second.png");

    assert.equal(result, `${first}\n![second.png](https://cdn/second.png)`);
});

test("removes the matching placeholder and detects unresolved placeholders", () => {
    const placeholder = createImageUploadPlaceholder("first.png", "upload-1");
    const body = `before\n${placeholder}\nafter`;

    const result = removeImageUploadPlaceholder(body, placeholder);

    assert.equal(result, "before\nafter");
    assert.equal(hasUnresolvedImageUploadPlaceholders(body), true);
    assert.equal(hasUnresolvedImageUploadPlaceholders(result), false);
});

test("returns publish block messages for uploading and failed images", () => {
    assert.equal(
        getImageUploadPublishBlockMessage([{ status: "uploading" }], "body"),
        "Images are still uploading.",
    );
    assert.equal(
        getImageUploadPublishBlockMessage([{ status: "failed" }], "body"),
        "Some images failed to upload. Retry or remove them before publishing.",
    );
    assert.equal(
        getImageUploadPublishBlockMessage([], "![Uploading x…](luigi-upload://orphan)"),
        "Images are still uploading.",
    );
});
