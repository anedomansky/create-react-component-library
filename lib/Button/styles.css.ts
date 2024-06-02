import { style } from "@vanilla-extract/css";

export const button = style({
  padding: "8px 16px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "blue",
  color: "white",
  ":hover": {
    backgroundColor: "darkblue",
  },
});
