"use client";
import {Text} from '@react-three/drei';
import {useEffect, useMemo, useRef} from 'react';
import {
    BufferGeometry,
    CylinderGeometry,
    EdgesGeometry, Float32BufferAttribute, Group,
    Mesh,
    Vector3,
} from "three";
import {useDispatch, useSelector} from "react-redux";
import {slotsList as sSlotsList} from "@/redux/slices/gamesSlice";
import {setSlotEdgeAngles, SlotEdgeAngle} from "@/redux/slices/roulette3dSlice";
import {CellData} from "@/utils/getGamesList";

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
    const dispatch = useDispatch();
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

    // useFrame((state, delta) => {
    //     if (groupRef.current) {
    //         groupRef.current.rotation.y += delta * finalSpeed;
    //     }
    // });

    useEffect(() => {
        const slotEdgeAngles: Array<SlotEdgeAngle> = allGamesList.map(({formattedValue}: CellData, index): SlotEdgeAngle => {
            const edgeAngle = (index / segments) * Math.PI * 2;
            return {formattedValue, edgeAngle};
        });
        dispatch(setSlotEdgeAngles(slotEdgeAngles));
    }, [allGamesList, dispatch, segments]);

    const edgesGeometry = useMemo(() => new EdgesGeometry(geometry), [geometry]);

    const spiderWebGeometry = useMemo<BufferGeometry>(() => {
        const positions = new Float32Array(segments * 6);
        const yTop = height / 2;
        let idx = 0;

        for (let i = 0; i < segments; i++) {
            const angle = (i / segments - .25) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            positions[idx++] = x;
            positions[idx++] = yTop;
            positions[idx++] = z;

            positions[idx++] = 0;
            positions[idx++] = yTop;
            positions[idx++] = 0;
        }
        const g = new BufferGeometry();
        g.setAttribute('position', new Float32BufferAttribute(positions, 3));
        return g;
    }, [segments, radius, height]);

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

        const textRotation = Math.atan2(normal.z, normal.x);

        return (
            <group key={index}>
                <Text
                    position={[textX, textY, textZ]}
                    rotation={[0, -textRotation + Math.PI / 2, Math.PI / 2]}
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {item.formattedValue}
                </Text>
                <group rotation={[0, -textRotation, 0]} key={index} position={[textX, textY + 0.001, textZ]}>
                    <Text
                        position={[-0.1, height / 2, 0]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        fontSize={0.15}
                        color="white"
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
            <lineSegments geometry={edgesGeometry}>
                <lineBasicMaterial attach="material" color={'white'}/>
            </lineSegments>
            <lineSegments geometry={spiderWebGeometry} position={[0, 0.001, 0]}>
                <lineBasicMaterial attach="material" color={'white'}/>
            </lineSegments>
            <mesh ref={cylinderRef} geometry={geometry}>
                <meshStandardMaterial attach="material" color="#444"/>
            </mesh>

            {textMeshes}
        </group>
    );
}

export default ThreeDynamicTable;