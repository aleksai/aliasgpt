import { useRef, useImperativeHandle, useState, useEffect } from "react";
import { useWidgetProps } from "../utils/use-widget-props";
import { useMaxHeight } from "../utils/use-max-height";
import { useDisplayMode } from "../utils/use-display-mode";
import {
  useNavigate,
  useParams
} from "react-router-dom";

export default function App() {
  return (
    <div className="antialiased w-full text-black px-4 pb-2 border border-black/10 rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
      Hello world
    </div>
  );
}
