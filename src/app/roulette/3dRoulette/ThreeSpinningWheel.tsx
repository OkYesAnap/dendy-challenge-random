"use client";
import {Text} from '@react-three/drei';
import {useEffect, useMemo, useRef} from 'react';
import {
    CylinderGeometry,
    Group,
    Vector3,
} from "three";
import {useDispatch, useSelector} from "react-redux";
import {allWeight as sAllWeight, slotsList as sSlotsList} from "@/redux/slices/gamesSlice";
import {
    rotationOptions as sRotationOptions,
    rotationSpeed as sRotationSpeed,
    slotEdgeAngles as sSlotEdgeAngles,
    setCurrentGame,
    setSlotEdgeAngles,
    SlotEdgeAngle
} from "@/redux/slices/roulette3dSlice";
import {CellData} from "@/utils/getGamesList";
import {calcHeight, calcRadius} from "@/app/roulette/3dRoulette/utils";
import {useFrame} from "@react-three/fiber";
import {finalSpeed} from "@/app/roulette/3dRoulette/threeConstants";
import {randomColorShader, vertexShader} from "@/app/roulette/3dRoulette/shaders";
// import RoulettePocket from "@/app/roulette/3dRoulette/RoulettePocket";

const getShift = (segments: number) => {
    if (segments <= 2) {
        return -0.19;
    } else if (segments <= 3) {
        return -1.74;
    } else if (segments <= 4) {
        return -1;
    } else if (segments <= 5) {
        return -0.66;
    } else if (segments <= 6) {
        return -0.45;
    } else if (segments <= 7) {
        return -0.33;
    } else if (segments <= 8) {
        return -0.25;
    } else if (segments <= 10) {
        return -0.17;
    }else if (segments <= 12) {
        return -0.10;
    } else if (segments <= 16) {
        return -0.06;
    } else if (segments <= 20) {
        return -0.04;
    } else return 0;
};

function ThreeSpinningWheel() {
    const slotsList = useSelector(sSlotsList);
    const rotationSpeed = useSelector(sRotationSpeed);
    const rotationOptions = useSelector(sRotationOptions);
    const allWeight = useSelector(sAllWeight);
    const slotEdgeAngles = useSelector(sSlotEdgeAngles)
    const dispatch = useDispatch();
    const groupRef = useRef<Group>(null);
    const segments = slotsList.length;
    const maxLength = Math.max(...slotsList.map(slot => slot.formattedValue.length));
    const shift = getShift(segments);
    const radius = calcRadius(segments);
    const height = calcHeight(maxLength);
    const started = useRef(false);

    // Compute normalized cumulative boundaries for variable-segment shader
    const boundaries = useMemo(() => {
        const bounds = new Float32Array(100);
        let cumAngle = 0;
        for (let i = 0; i < segments; i++) {
            const rotationPercent = ((slotsList[i].weight || 0) / allWeight);
            cumAngle = allWeight > 0 ? (cumAngle + rotationPercent) : ((i + 1) / segments);
            bounds[i] = cumAngle;
        }
        return bounds;
    }, [slotsList, allWeight, segments]);

    const geometry = useMemo(
        () => new CylinderGeometry(radius, radius, height, 100),
        [height, radius]
    );

    useEffect(() => {
        if (rotationSpeed === finalSpeed && started.current) dispatch(setCurrentGame({wheelAngle: groupRef.current?.rotation.y}));
        if (rotationSpeed !== finalSpeed) {started.current = true;}
    }, [rotationSpeed, dispatch]);

    useFrame((state, delta) => {
        if (groupRef.current && rotationOptions.wheelSpin) {
            groupRef.current.rotation.y -= Number((delta * rotationSpeed).toFixed(4));
        }
    });

    useEffect(() => {
        let totalAngles = 0;
        const slotEdgeAngles: Array<SlotEdgeAngle> = slotsList.map(({formattedValue, weight}: CellData, index): SlotEdgeAngle => {
            const rotationAngle = (allWeight > 0 ? ((weight || 0) / allWeight) : 1 / segments) * 2 * Math.PI;
            const edgeStartAngle = totalAngles;
            totalAngles += rotationAngle;
            return {formattedValue, edgeStartAngle, rotationAngle, index};
        });
        dispatch(setSlotEdgeAngles(slotEdgeAngles));
    }, [slotsList, dispatch, segments]);
    const textMeshes = slotEdgeAngles.map((item, index) => {
        const angle = (item.edgeStartAngle);
        const centerAngle =  angle + Math.PI/2 + item.rotationAngle/2;

        const x = Math.cos(centerAngle) * (radius + shift);
        const y = 0;
        const z = Math.sin(centerAngle) * (radius + shift);

        const normal = new Vector3(x, y, z).normalize();

        const offset = 0;
        const textX = x + normal.x * offset;
        const textY = y + normal.y * offset;
        const textZ = z + normal.z * offset;

        const color = ((index + segments % 2) % 2) ? "black" : "white";
        // const color = "black";

        const textRotation = Math.atan2(normal.z, normal.x);
        // const pocketColor = ((index + segments % 2) % 2) ? "#2C3E50" : "#ECF0F1";
        return (
            <group key={index}>
                <Text
                    position={[textX, textY + height / 2 - 0.1, textZ]}
                    rotation={[0, -textRotation + Math.PI / 2, Math.PI / 2]}
                    fontSize={0.2}
                    color={color}
                    anchorX="right"
                    anchorY="middle"
                >
                    {item.formattedValue}
                </Text>
                <group rotation={[0, -textRotation, 0]} key={index} position={[textX, textY + 0.001, textZ]}>
                    <Text
                        position={[-0.1, height / 2, 0]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        fontSize={0.15}
                        color={color}
                        anchorX="right"
                        anchorY="middle"
                    >
                        {item.formattedValue}
                    </Text>
                </group>
                {/*<RoulettePocket*/}
                {/*    position={[x, textY + height / 2 + 0.07, z]}*/}
                {/*    rotationY={-textRotation}*/}
                {/*    color={pocketColor}*/}
                {/*/>*/}
            </group>
        );
    });


    return (
        <group ref={groupRef}>
            <mesh geometry={geometry} key={`${geometry.uuid}-seg-${segments}`}>
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={randomColorShader}
                    uniforms={{
                        // uWhite: { value: new Color(0xDFDFDFFF) },
                        // uBlack: { value: new Color(0x000000) },
                        uSegments: { value: segments },
                        uBoundaries: { value: boundaries },
                    }}
                    lights={false}
                />
            </mesh>
            {textMeshes}
        </group>
    );
}

export default ThreeSpinningWheel;