import test from "node:test";
import assert from "node:assert/strict";

import { getCodeBlockSyntaxStyles } from "./code-block-theme.ts";

test("markdown code block syntax styles keep the code surface and lines transparent", () => {
    const darkStyles = getCodeBlockSyntaxStyles("dark");
    const lightStyles = getCodeBlockSyntaxStyles("light");

    for (const styles of [darkStyles, lightStyles]) {
        assert.equal(styles.customStyle.background, "transparent");
        assert.equal(styles.customStyle.lineHeight, 1.7);
        assert.equal(styles.customStyle.overflowX, "auto");
        assert.equal(styles.codeTagProps.style.background, "transparent");
        assert.equal(styles.lineProps.style.background, "transparent");
        assert.equal(styles.lineProps.style.display, "block");
    }

    assert.equal(darkStyles.customStyle.color, "rgba(255, 255, 255, 0.84)");
    assert.equal(lightStyles.customStyle.color, "rgba(15, 23, 42, 0.86)");
});
