import type { Route } from "./+types/home";
import { Index } from "../index/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ez-Connecty" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Index />;
}
