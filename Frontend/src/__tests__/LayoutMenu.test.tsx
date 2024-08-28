import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LayoutMenu from "@/Pages/Todo/ProjectMenu";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import userEvent from "@testing-library/user-event";
import MockPointerEvent from "../../__mocks__/pointerEvent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

vi.mock("zustand");

describe("LayoutMenu", () => {
  beforeEach(() => {
    useTodoxStore.getState().reset();
  });

  it("renders default menu items", () => {
    renderLayout();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Create new project")).toBeInTheDocument();
    expect(screen.getByText("Coming soon!")).toBeInTheDocument();
  });

  it("opens create project dialog on button click", async () => {
    renderLayout();

    const createButton = screen.getByTestId("create-new-project-open-button");
    expect(createButton).toBeInTheDocument();

    await userEvent.click(createButton);

    expect(
      screen.getByTestId("create-new-project-dialog-title"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });

  it("creates a new project with all fields filled and renders", async () => {
    renderLayout();
    fireEvent.click(screen.getByTestId("create-new-project-open-button"));

    await waitFor(() => {
      const dialogTitle = screen.getByTestId("create-new-project-dialog-title");
      expect(dialogTitle).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const selectTrigger = screen.getByRole("combobox", {
      name: "status",
    });
    expect(selectTrigger).toBeInTheDocument();

    await userEvent.type(titleInput, "New Project");
    fireEvent.change(descriptionInput, {
      target: { value: "Project Description" },
    });
    await userEvent.click(selectTrigger);

    expect(screen.getByRole("option", { name: "Active" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("option", { name: "Active" }));

    expect(selectTrigger).toHaveAttribute("aria-expanded", "false");

    const submitButton = screen.getByTestId("create-project-action");
    fireEvent.click(submitButton);

    // Open the status dropdown

    await waitFor(() => {
      const projects = useTodoxStore.getState().projects;

      expect(Object.keys(projects)).toHaveLength(1);

      const project = projects[Object.keys(projects)[0]];
      expect(project.title).toBe("New Project");
      expect(project.description).toBe("Project Description");
      expect(project.status).toBe("active");

      expect(
        screen.getByTestId(`project-item-${Object.keys(projects)[0]}`),
      ).toBeInTheDocument();
    });
  });

  it("validates required fields", async () => {
    renderLayout();

    await userEvent.click(screen.getByTestId("create-new-project-open-button"));

    // Try to submit without filling any fields
    await userEvent.click(screen.getByTestId("create-project-action"));

    // Check if the form is still open (not submitted due to validation)
    expect(
      screen.getByTestId("create-new-project-dialog-title"),
    ).toBeInTheDocument();

    // Check if the projects store is still empty
    expect(Object.keys(useTodoxStore.getState().projects)).toHaveLength(0);
  });

  it("closes the dialog without creating a project when clicking outside", async () => {
    renderLayout();
    await userEvent.click(screen.getByTestId("create-new-project-open-button"));

    // Simulate clicking outside the dialog
    fireEvent.keyDown(document.body, { key: "Escape", code: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByTestId("create-new-project-dialog-title"),
      ).not.toBeInTheDocument();
    });

    // Check if no project was created
    expect(Object.keys(useTodoxStore.getState().projects)).toHaveLength(0);
  });
});

function renderLayout() {
  return render(
    <BrowserRouter>
      <LayoutMenu />
    </BrowserRouter>,
  );
}
