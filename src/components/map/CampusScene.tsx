import { Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Box3, Group, PerspectiveCamera, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls.js";
import type { NftGoodsItem } from "../../apis/blockchain/blockchain";

const MODEL_PATHS = [
  "/models/gonghak.glb",
  "/models/jiseon.glb",
  "/models/naksan.glb",
  "/models/wuchon.glb",
  "/models/yeongu.glb",
  "/models/sangsang.glb",
  "/models/jinri.glb",
  "/models/haksong.glb",
  "/models/changui.glb",
  "/models/mirae.glb",
  "/models/tamgu.glb",
] as const;

const REVERSE_FOCUS_INDEXES = [0, 1, 4, 6, 7, 9, 10];
const LOW_FOCUS_INDEXES = [0, 1, 6, 7];
const GONGHAK_INDEX = 0;
const JISEON_INDEX = 1;
const NAKSAN_INDEX = 2;
const WUCHON_INDEX = 3;
const YEONGU_INDEX = 4;
const JINRI_INDEX = 6;
const HAKSONG_INDEX = 7;
const CHANGUI_INDEX = 8;
const MIRAE_INDEX = 9;
const TAMGU_INDEX = 10;
const DEFAULT_CAMERA_INDEXES = [5, 6, 7];

type CampusModelProps = {
  path: string;
};

type CampusSceneProps = {
  goods: NftGoodsItem[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onClear: () => void;
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

type FocusItem = {
  index: number;
  target: Vector3;
  cameraPosition: Vector3;
};

type CampusModelsProps = {
  goods: NftGoodsItem[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  loading: boolean;
};

function CampusModels({ goods, selectedIndex, onSelect, loading }: CampusModelsProps) {
  const groupRef = useRef<Group>(null);
  const modelRefs = useRef<Array<Group | null>>([]);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const defaultViewRef = useRef<{ target: Vector3; cameraPosition: Vector3 } | null>(null);
  const targetViewRef = useRef<{ target: Vector3; cameraPosition: Vector3 } | null>(null);
  const [anchors, setAnchors] = useState<AnchorItem[]>([]);
  const [focusItems, setFocusItems] = useState<FocusItem[]>([]);
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
    const nextFocusItems: FocusItem[] = [];
    for (let i = 0; i < modelRefs.current.length; i += 1) {
      const modelGroup = modelRefs.current[i];
      const item = goods[i];
      if (!modelGroup || !item) continue;

      const modelBox = new Box3().setFromObject(modelGroup);
      if (modelBox.isEmpty()) continue;

      const centerWorld = modelBox.getCenter(new Vector3());
      const topWorld = new Vector3(centerWorld.x, modelBox.max.y, centerWorld.z);
      const centerLocal = root.worldToLocal(centerWorld.clone());
      const topLocal = root.worldToLocal(topWorld.clone());
      const modelSize = modelBox.getSize(new Vector3());
      const focusDistance = Math.max(modelSize.x, modelSize.y, modelSize.z, 24) * 4.2;
      const targetOffset = LOW_FOCUS_INDEXES.includes(item.index) ? 2 : 0.6;
      const target = new Vector3(centerWorld.x, modelBox.min.y - modelSize.y * targetOffset, centerWorld.z);
      const focusX = REVERSE_FOCUS_INDEXES.includes(item.index) ? focusDistance * 0.85 : -focusDistance * 0.85;
      const cameraY = item.index === GONGHAK_INDEX ? 0.7 : item.index === JISEON_INDEX ? 0.6 : item.index === NAKSAN_INDEX ? 0.8 : item.index === WUCHON_INDEX ? 0.9 : item.index === YEONGU_INDEX ? 0.8 : item.index === CHANGUI_INDEX ? 0.8 : item.index === MIRAE_INDEX ? 0.8 : item.index === TAMGU_INDEX ? 0.8 : DEFAULT_CAMERA_INDEXES.includes(item.index) ? 0.58 : 0.3;
      const cameraOffset = new Vector3(focusX, focusDistance * cameraY, focusDistance);
      if (item.index === GONGHAK_INDEX || item.index === JISEON_INDEX) {
        cameraOffset.multiplyScalar(0.5);
      }
      if (item.index === NAKSAN_INDEX) {
        cameraOffset.multiplyScalar(0.4);
      }
      if (item.index === WUCHON_INDEX) {
        cameraOffset.multiplyScalar(0.5);
      }
      if (item.index === YEONGU_INDEX) {
        cameraOffset.multiplyScalar(0.7);
      }
      if (item.index === CHANGUI_INDEX) {
        cameraOffset.multiplyScalar(0.6);
        cameraOffset.applyAxisAngle(new Vector3(0, 1, 0), (Math.PI * -15) / 180);
      }
      if (item.index === MIRAE_INDEX) {
        cameraOffset.multiplyScalar(0.6);
        cameraOffset.applyAxisAngle(new Vector3(0, 1, 0), (Math.PI * 20) / 180);
      }
      if (item.index === TAMGU_INDEX) {
        cameraOffset.multiplyScalar(0.5);
      }
      if (item.index === JINRI_INDEX) {
        cameraOffset.multiplyScalar(0.5);
        cameraOffset.applyAxisAngle(new Vector3(0, 1, 0), (Math.PI * 15) / 180);
      }
      if (item.index === HAKSONG_INDEX) {
        cameraOffset.multiplyScalar(0.78);
        cameraOffset.applyAxisAngle(new Vector3(0, 1, 0), (Math.PI * 25) / 180);
      }

      nextAnchors.push({
        index: item.index,
        position: [centerLocal.x, topLocal.y + 3.2, centerLocal.z],
      });
      nextFocusItems.push({
        index: item.index,
        target,
        cameraPosition: target.clone().add(cameraOffset),
      });
    }

    setAnchors(nextAnchors);
    setFocusItems(nextFocusItems);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera.fov * Math.PI) / 180;
    const distance = Math.max(maxDim / (2 * Math.tan(fov / 2)), maxDim) * 1.7;
    const defaultTarget = new Vector3(0, size.y * 0.2, 0);
    const defaultCameraPosition = new Vector3(distance * -0.9, distance * 0.72, distance * 1.05);

    camera.position.copy(defaultCameraPosition);
    camera.near = 0.1;
    camera.far = distance * 10;
    camera.lookAt(defaultTarget);
    camera.updateProjectionMatrix();
    defaultViewRef.current = { target: defaultTarget, cameraPosition: defaultCameraPosition };
    targetViewRef.current = { target: defaultTarget.clone(), cameraPosition: defaultCameraPosition.clone() };
    if (controlsRef.current) {
      controlsRef.current.target.copy(defaultTarget);
      controlsRef.current.update();
    }
    invalidate();
  }, [camera, goods, invalidate]);

  useLayoutEffect(() => {
    const selectedItem = focusItems.find((item) => item.index === selectedIndex);
    if (selectedItem) {
      targetViewRef.current = {
        target: selectedItem.target.clone(),
        cameraPosition: selectedItem.cameraPosition.clone(),
      };
      return;
    }

    if (defaultViewRef.current) {
      targetViewRef.current = {
        target: defaultViewRef.current.target.clone(),
        cameraPosition: defaultViewRef.current.cameraPosition.clone(),
      };
    }
  }, [focusItems, selectedIndex]);

  useFrame(() => {
    if (!targetViewRef.current || !controlsRef.current) return;

    camera.position.lerp(targetViewRef.current.cameraPosition, 0.08);
    controlsRef.current.target.lerp(targetViewRef.current.target, 0.08);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(targetViewRef.current.cameraPosition) < 0.5 &&
      controlsRef.current.target.distanceTo(targetViewRef.current.target) < 0.5
    ) {
      targetViewRef.current = null;
    }
  });

  const getItem = (index: number) => goods.find((item) => item.index === index);

  return (
    <>
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
            <Html key={item.index} position={anchor.position} transform distanceFactor={100}>
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
                  {item.isSold && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                </span>
              </button>
            </Html>
          );
        })}
      </group>
      <OrbitControls
        ref={(node) => {
          controlsRef.current = node as unknown as OrbitControlsImpl;
        }}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={80}
        maxDistance={420}
        onStart={() => {
          targetViewRef.current = null;
        }}
      />
    </>
  );
}

function CampusSceneFallback() {
  return (
    <Html center>
      <div className="rounded-full bg-black/45 px-12 py-6 text-sm font-medium text-white backdrop-blur">
        3D campus loading...
      </div>
    </Html>
  );
}

export default function CampusScene({
  goods,
  selectedIndex,
  onSelect,
  onClear,
  loading,
}: CampusSceneProps) {
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [180, 120, 180], fov: 50, near: 0.1, far: 3000 }}
        onPointerDown={(event) => {
          pointerStartRef.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerMissed={(event) => {
          const start = pointerStartRef.current;
          if (!start) {
            onClear();
            return;
          }

          const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
          if (moved < 6) {
            onClear();
          }
        }}
        style={{ zIndex: 0 }}
      >
        <color attach="background" args={["#f7dfc4"]} />
        {/* <fog attach="fog" args={["#95b75f", 220, 520]} /> */}

        <ambientLight intensity={1.7} />
        <hemisphereLight intensity={1.1} groundColor="#6f8553" />
        <directionalLight position={[180, 220, 120]} intensity={2.2} castShadow />
        <directionalLight position={[-120, 80, -80]} intensity={0.85} />

        <Suspense fallback={<CampusSceneFallback />}>
          <CampusModel path="/models/env.glb" />
          <CampusModels
            goods={goods}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
            loading={loading}
          />
        </Suspense>

      </Canvas>
    </div>
  );
}

MODEL_PATHS.forEach((path) => {
  useGLTF.preload(path);
});
useGLTF.preload("/models/env.glb");
