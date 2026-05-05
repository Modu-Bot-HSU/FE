import { Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Box3, Group, PerspectiveCamera, Vector3 } from "three";
import type { NftGoodsItem } from "../../apis/blockchain/blockchain";

const MODEL_PATHS = [
  "/models/gonghak.glb",
  "/models/jiseon.glb",
  "/models/naksan.glb",
  "/models/wuchon.glb",
  "/models/yeongu.glb",
] as const;

type CampusModelProps = {
  path: (typeof MODEL_PATHS)[number];
};

type CampusSceneProps = {
  goods: NftGoodsItem[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  loading: boolean;
};

function CampusModel({ path }: CampusModelProps) {
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return <primitive object={clonedScene} />;
}

type AnchorItem = {
  index: number;
  position: [number, number, number];
};

type CampusModelsProps = {
  goods: NftGoodsItem[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  loading: boolean;
};

function CampusModels({
  goods,
  selectedIndex,
  onSelect,
  loading,
}: CampusModelsProps) {
  const groupRef = useRef<Group>(null);
  const modelRefs = useRef<Array<Group | null>>([]);
  const [anchors, setAnchors] = useState<AnchorItem[]>([]);
  const { camera, invalidate } = useThree();

  useLayoutEffect(() => {
    if (!groupRef.current) return;
    if (!(camera instanceof PerspectiveCamera)) return;

    const root = groupRef.current;
    const box = new Box3().setFromObject(root);
    if (box.isEmpty()) {
      setAnchors([]);
      return;
    }

    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    root.position.set(-center.x, -box.min.y, -center.z);
    root.updateWorldMatrix(true, true);

    const nextAnchors: AnchorItem[] = [];
    for (let i = 0; i < modelRefs.current.length; i += 1) {
      const modelGroup = modelRefs.current[i];
      const item = goods[i];
      if (!modelGroup || !item) continue;

      const modelBox = new Box3().setFromObject(modelGroup);
      if (modelBox.isEmpty()) continue;

      const centerWorld = modelBox.getCenter(new Vector3());
      const topWorld = new Vector3(
        centerWorld.x,
        modelBox.max.y,
        centerWorld.z,
      );
      const centerLocal = root.worldToLocal(centerWorld.clone());
      const topLocal = root.worldToLocal(topWorld.clone());

      nextAnchors.push({
        index: item.index,
        position: [centerLocal.x, topLocal.y + 3.2, centerLocal.z],
      });
    }

    setAnchors(nextAnchors);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera.fov * Math.PI) / 180;
    const distance = Math.max(maxDim / (2 * Math.tan(fov / 2)), maxDim) * 1.35;

    camera.position.set(distance * 0.9, distance * 0.72, distance * 1.05);
    camera.near = 0.1;
    camera.far = distance * 10;
    camera.lookAt(0, size.y * 0.2, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, goods, invalidate]);

  const getItem = (index: number) => goods.find((item) => item.index === index);

  return (
    <group ref={groupRef}>
      {MODEL_PATHS.map((path, i) => {
        const item = goods[i];

        return (
          <group
            key={path}
            ref={(node) => {
              modelRefs.current[i] = node;
            }}
            onClick={(event) => {
              event.stopPropagation();
              console.log("[CampusScene] building click", {
                modelPath: path,
                item,
                loading,
              });
              if (!loading && item) {
                onSelect(item.index);
              }
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
              if (!loading && item) {
                onSelect(item.index);
              }
            }}
          >
            <CampusModel path={path} />
          </group>
        );
      })}

      {anchors.map((anchor) => {
        const item = getItem(anchor.index);
        if (!item) return null;

        const isSelected = selectedIndex === item.index;

        return (
          <Html
            key={item.index}
            position={anchor.position}
            transform
            occlude="blending"
            distanceFactor={16}
          >
            <button
              onClick={(event) => {
                event.stopPropagation();
                console.log("[CampusScene] label click", {
                  index: item.index,
                  name: item.name,
                  loading,
                });
                onSelect(item.index);
              }}
              onPointerDown={(event) => event.stopPropagation()}
              disabled={loading}
              className={`rounded-full border px-4 py-1.5 text-lg font-semibold shadow transition whitespace-nowrap ${
                isSelected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white/95 text-slate-800"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                {item.name}
                {item.isSold && (
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                )}
              </span>
            </button>
          </Html>
        );
      })}
    </group>
  );
}

function CampusSceneFallback() {
  return (
    <Html center>
      <div className="rounded-full bg-black/45 px-4 py-2 text-sm font-medium text-white backdrop-blur">
        3D campus loading...
      </div>
    </Html>
  );
}

export default function CampusScene({
  goods,
  selectedIndex,
  onSelect,
  loading,
}: CampusSceneProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [180, 120, 180], fov: 35, near: 0.1, far: 3000 }}
        style={{ zIndex: 0 }}
      >
        <color attach="background" args={["#95b75f"]} />
        <fog attach="fog" args={["#95b75f", 220, 520]} />

        <ambientLight intensity={1.7} />
        <hemisphereLight intensity={1.1} groundColor="#6f8553" />
        <directionalLight
          position={[180, 220, 120]}
          intensity={2.2}
          castShadow
        />
        <directionalLight position={[-120, 80, -80]} intensity={0.85} />

        <Suspense fallback={<CampusSceneFallback />}>
          <CampusModels
            goods={goods}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
            loading={loading}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2.15}
          minDistance={80}
          maxDistance={420}
        />
      </Canvas>
    </div>
  );
}

MODEL_PATHS.forEach((path) => {
  useGLTF.preload(path);
});
