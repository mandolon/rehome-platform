import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";

describe("UI kit renders", () => {
  it("renders Button and Card", () => {
    render(<Card><Button>Click</Button></Card>);
    expect(screen.getByText("Click")).toBeInTheDocument();
  });
});