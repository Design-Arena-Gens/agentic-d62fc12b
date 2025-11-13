import dynamic from "next/dynamic";

const SceneCanvas = dynamic(() => import("../components/SceneCanvas"), { ssr: false });

export default function Page() {
  return <SceneCanvas />;
}
