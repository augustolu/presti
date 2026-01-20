import { render, screen } from "@testing-library/react";
import Contact from "./Contact";

// Mocking IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe("Contact component", () => {
  it("should render without hydration errors", async () => {
    render(<Contact />);
    // Wait for the stars to be generated
    await screen.findAllByRole("figure");
    // Check that 30 stars are rendered
    expect(screen.getAllByRole("figure").length).toBe(30);
  });
});
