import { createDialogManager } from "./dialogManager";

describe("shared dialog manager", () => {
  it("should accept only one request from two synchronous entry points", () => {
    // Arrange
    const target = createDialogManager();
    const firstButton = () => target.acquire("coming-soon");
    const secondButton = () => target.acquire("coming-soon");
    // Act
    const results = [firstButton(), secondButton()];
    // Assert
    expect(results).toEqual([true, false]);
  });

  it("should suppress other dialogs until the current dialog closes", () => {
    const target = createDialogManager();
    target.acquire("coming-soon");
    expect(target.acquire("link-error")).toBe(false);
    target.release("coming-soon");
    expect(target.acquire("link-error")).toBe(true);
  });

  it("should allow reopening after close but ignore stale releases", () => {
    const target = createDialogManager();
    target.acquire("coming-soon");
    target.release("link-error");
    expect(target.acquire("coming-soon")).toBe(false);
    target.release("coming-soon");
    expect(target.acquire("coming-soon")).toBe(true);
  });
});
