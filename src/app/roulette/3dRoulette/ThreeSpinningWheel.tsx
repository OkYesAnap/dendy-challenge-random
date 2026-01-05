"use client";
import {Text} from '@react-three/drei';
import {useEffect, useMemo, useRef} from 'react';
import {
    Color,
    CylinderGeometry,
    Group,
    Vector3,
} from "three";
import {useDispatch, useSelector} from "react-redux";
import {slotsList as sSlotsList} from "@/redux/slices/gamesSlice";
import {
    rotationOptions as sRotationOptions,
    rotationSpeed as sRotationSpeed,
    setCurrentGame,
    setSlotEdgeAngles,
    SlotEdgeAngle
} from "@/redux/slices/roulette3dSlice";
import {CellData} from "@/utils/getGamesList";
import {calcHeight, calcRadius} from "@/app/roulette/3dRoulette/utils";
import {useFrame} from "@react-three/fiber";
import {finalSpeed} from "@/app/roulette/3dRoulette/threeConstants";
import {fragmentShader, vertexShader} from "@/app/roulette/3dRoulette/shaders";

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
    const allGamesList = useSelector(sSlotsList);
    const rotationSpeed = useSelector(sRotationSpeed);
    const rotationOptions = useSelector(sRotationOptions);
    const dispatch = useDispatch();
    const groupRef = useRef<Group>(null);
    const segments = allGamesList.length;
    const maxLength = Math.max(...allGamesList.map(slot => slot.formattedValue.length));
    const shift = getShift(segments);
    const radius = calcRadius(segments);
    const height = calcHeight(maxLength);

    const geometry = useMemo(
        () => new CylinderGeometry(radius, radius, height, segments),
        [segments, height, radius]
    );

    useEffect(() => {
        if (rotationSpeed === finalSpeed) dispatch(setCurrentGame({wheelAngle: groupRef.current?.rotation.y}));
    }, [rotationSpeed, dispatch]);

    useFrame((state, delta) => {
        if (groupRef.current && rotationOptions.wheelSpin) {
            groupRef.current.rotation.y -= Number((delta * rotationSpeed).toFixed(4));
        }
    });

    useEffect(() => {
        const slotEdgeAngles: Array<SlotEdgeAngle> = allGamesList.map(({formattedValue}: CellData, index): SlotEdgeAngle => {
            const edgeAngle = (index / segments) * Math.PI * 2;
            return {formattedValue, edgeAngle, index};
        });
        dispatch(setSlotEdgeAngles(slotEdgeAngles));
    }, [allGamesList, dispatch, segments]);

    const textMeshes = allGamesList.map((item, index) => {
        const angle = (index / segments) * Math.PI * 2 + Math.PI / 2;
        const segmentAngle = (2 * Math.PI) / segments;
        const centerAngle = angle + segmentAngle / 2;

        const x = Math.cos(centerAngle) * (radius + shift);
        const y = 0;
        const z = Math.sin(centerAngle) * (radius + shift);

        const normal = new Vector3(x, y, z).normalize();

        const offset = 0;
        const textX = x + normal.x * offset;
        const textY = y + normal.y * offset;
        const textZ = z + normal.z * offset;

        const color = ((index + segments % 2) % 2) ? "black" : "white";

        const textRotation = Math.atan2(normal.z, normal.x);

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
            </group>
        );
    });


    return (
        <group ref={groupRef}>
            <mesh geometry={geometry} key={`${geometry.uuid}-seg-${segments}`}>
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{
                        uWhite: { value: new Color(0xDFDFDFFF) },
                        uBlack: { value: new Color(0x000000) },
                        uSegments: { value: segments },
                    }}
                    lights={false}
                />
            </mesh>
            {textMeshes}
        </group>
    );
}

export default ThreeSpinningWheel;