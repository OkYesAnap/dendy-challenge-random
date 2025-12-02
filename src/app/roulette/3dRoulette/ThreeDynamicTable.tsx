"use client";
import {Text} from '@react-three/drei';
import {useMemo, useRef} from 'react';
import {
    CylinderGeometry,
    EdgesGeometry, Group,
    LineBasicMaterial,
    LineSegments, Mesh,
    Vector3,
} from "three";
import {useFrame} from "@react-three/fiber";
import {useSelector} from "react-redux";
import {slotsList as sSlotsList} from "@/redux/slices/gamesSlice";
import {finalSpeed} from "@/app/roulette/3dRoulette/threeConstants";

const getShift = (segments: number) => {
    if (segments <= 2) {
        return -0.19;
    } else if (segments <= 3) {
        return -0.14;
    } else if (segments <= 4) {
        return -0.1;
    } else if (segments <= 5) {
        return -0.07;
    } else if (segments <= 6) {
        return -0.06;
    } else if (segments <= 8) {
        return -0.05;
    } else if (segments <= 12) {
        return -0.04;
    } else if (segments <= 16) {
        return -0.03;
    } else if (segments <= 20) {
        return -0.02;
    } else return 0;
};

function ThreeDynamicTable() {
    const allGamesList = useSelector(sSlotsList);

    const groupRef = useRef<Group>(null);
    const cylinderRef = useRef<Mesh>(null);
    const segments = allGamesList.length;
    const maxLength = Math.max(...allGamesList.map(slot => slot.formattedValue.length));
    const shift = getShift(segments);
    const radius = segments / 10;
    const height = maxLength * 0.1;

    const geometry = useMemo(
        () => new CylinderGeometry(radius, radius, height, segments),
        [segments, height, radius]
    );

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * finalSpeed;
        }
    });

    const edgesGeometry = useMemo(() => new EdgesGeometry(geometry), [geometry]);

    const textMeshes = allGamesList.map((item, index) => {
        const angle = (index / segments + .25) * Math.PI * 2;
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

        const textRotation = Math.atan2(normal.z, normal.x);
        console.log(-textRotation + Math.PI / 2, index);

        return (
            <Text
                key={index}
                position={[textX, textY, textZ]}
                rotation={[0, -textRotation + Math.PI / 2, Math.PI / 2]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {item.formattedValue}
            </Text>
        );
    });

    return (<>
            <group ref={groupRef}>
                <primitive
                    object={new LineSegments(edgesGeometry, new LineBasicMaterial({color: "white"}))}
                />

                <mesh ref={cylinderRef} geometry={geometry}>
                    <meshStandardMaterial attach="material" color="#444"/>
                </mesh>
                {textMeshes}
            </group>
        </>
    );
}

export default ThreeDynamicTable;