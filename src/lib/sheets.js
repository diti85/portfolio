import { createContext, useContext } from "react";
import { scrollToId } from "./scroll";

// Sections that open as full-screen sheets instead of living on the page.
export const SHEET_IDS = ["work", "experience", "projects"];

// Anchors inside a sheet, so a link to #retention opens Work and scrolls there.
export const ANCHOR_SHEET = {
  ingestion: "work",
  observability: "work",
  retention: "work",
  clients: "projects",
};

export const sheetFor = (id) => (SHEET_IDS.includes(id) ? id : (ANCHOR_SHEET[id] ?? null));

export const SheetContext = createContext({
  openId: null,
  goTo: () => {},
  close: () => {},
  registerPanel: () => {},
});

export const useSheet = () => useContext(SheetContext);

// A bridge for callers outside React's tree of context (or that simply want
// a function): go to any id, opening its sheet if it has one.
let api = null;
export function setSheetApi(next) {
  api = next;
}
export function goTo(id, originEl) {
  if (api) api.goTo(id, originEl);
  else scrollToId(id);
}
