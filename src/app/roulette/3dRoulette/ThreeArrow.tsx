"use client";
import {
    CylinderGeometry,
    ConeGeometry,
    Mesh,
    MeshStandardMaterial, Group,
} from "three";
import {useDispatch, useSelector} from "react-redux";
import {useFrame} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import {slotsList as sSlotsList} from "@/redux/slices/gamesSlice";
import {
    rotationSpeed as sRotationSpeed,
    rotationOptions as sRotationOptions, setCurrentGame,
} from "@/redux/slices/roulette3dSlice";
import {calcRadius} from "@/app/roulette/3dRoulette/utils";
import {finalSpeed} from "@/app/roulette/3dRoulette/threeConstants";
import {useGLTF} from "@react-three/drei";


function DendyModel() {
    const { scene } = useGLTF('/models/dendy.glb');
    return <primitive position={[-0.1, 1.27, 0.2]} scale={0.3} object={scene} />;
}

function PulsingArrow() {
    const groupRef = useRef<Group>(null);
    const allGamesList = useSelector(sSlotsList);
    const rotationSpeed = useSelector(sRotationSpeed);
    const rotationOptions = useSelector(sRotationOptions);
    const dispatch = useDispatch();

    const segments = allGamesList.length;
    const maxLength = Math.max(...allGamesList.map(slot => slot.formattedValue.length));
    const height = calcRadius(segments);
    const additionalHeight = maxLength * 0.1 + .7;

    useEffect(() => {
        if (rotationSpeed === finalSpeed) dispatch(setCurrentGame({arrowAngle: groupRef.current?.rotation.y}));
    }, [rotationSpeed, dispatch]);

    useFrame((state, delta) => {
        if (groupRef.current && rotationOptions.arrowSpin) {
            groupRef.current.rotation.y += Number((delta * rotationSpeed).toFixed(4));
        }
    });


    return (
        <group ref={groupRef} position={[0, additionalHeight / 2 - 1.25, 0]}>
            <DendyModel/>
            <primitive
                object={new Mesh(
                    new CylinderGeometry(0.4, 0.4, 2.5, 10),
                    new MeshStandardMaterial({
                        color: "#f1c40f",
                        emissive: "#f39c12",
                        emissiveIntensity: 0.3
                    })
                )}
            />
            <group position={[0, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <primitive
                    object={new Mesh(
                        new CylinderGeometry(0.06, 0.06, height - 0.4, 4),
                        new MeshStandardMaterial({
                            color: "#f1c40f",
                            emissive: "#f39c12",
                            emissiveIntensity: 0.3
                        })
                    )}
                    position={[height / 2, 0, 0]}
                    rotation={[0, 0, Math.PI / 2]}
                />

                <primitive
                    object={new Mesh(
                        new ConeGeometry(0.12, 0.3, 4),
                        new MeshStandardMaterial({
                            color: "#f1c40f",
                            emissive: "#c0392b",
                            emissiveIntensity: 0.3
                        })
                    )}
                    position={[height - .16, 0, 0]}
                    rotation={[0, 0, -Math.PI / 2]}
                />
            </group>
        </group>
    );
}

export default PulsingArrow;