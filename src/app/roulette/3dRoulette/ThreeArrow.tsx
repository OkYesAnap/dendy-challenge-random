"use client";
import {
    CylinderGeometry,
    ConeGeometry,
    Mesh,
    MeshStandardMaterial, Group,
} from "three";
import {useSelector} from "react-redux";
import {slotsList as sSlotsList} from "@/redux/slices/gamesSlice";
import {useFrame} from "@react-three/fiber";
import {useEffect, useRef, useState} from "react";
import {finalSpeed} from "@/app/roulette/3dRoulette/threeConstants";

function PulsingArrow() {
    const groupRef = useRef<Group>(null);
    const timerRef = useRef<ReturnType<typeof setInterval>>(null);
    const [rotationSpeed, setRotationSpeed] = useState<number>(10);
    const allGamesList = useSelector(sSlotsList);

    const height = allGamesList.length * 0.1 - .2;
    const maxLength = Math.max(...allGamesList.map(slot => slot.formattedValue.length));
    const additionalHeight = maxLength * 0.1 + .5;

    useEffect(() => {
        if(rotationSpeed >= finalSpeed) {
            timerRef.current = setInterval(() => {
                setRotationSpeed(prev => {
                   if(prev > 1) {
                       prev -= 0.01;
                   } else {
                       prev -= 0.001;
                   }
                   return prev;
                });
            }, Math.random() * 20 + 10);
        } else if (timerRef.current) {
            setRotationSpeed(finalSpeed);
            clearInterval(timerRef.current);
        }
        return () => {
            if(timerRef.current) {
            clearInterval(timerRef.current);
            }
        };
    }, [setRotationSpeed, rotationSpeed]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y -= delta * rotationSpeed;
        }
    });

    return (
        <group ref={groupRef} position={[0, additionalHeight / 2 - 0.5, 0]}>
            <primitive
                object={new Mesh(
                    new CylinderGeometry(0.4, 0.4, 2.5, 16),
                    new MeshStandardMaterial({
                        color: "#f1c40f",
                        metalness: 0.3,
                        roughness: 0.7
                    })
                )}
            />
            <group position={[0, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <primitive
                    object={new Mesh(
                        new CylinderGeometry(0.06, 0.06, height, 8),
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
                        new ConeGeometry(0.12, 0.3, 8),
                        new MeshStandardMaterial({
                            color: "#f1c40f",
                            emissive: "#c0392b",
                            emissiveIntensity: 0.5
                        })
                    )}
                    position={[height, 0, 0]}
                    rotation={[0, 0, -Math.PI / 2]}
                />
            </group>
        </group>
    );
}

export default PulsingArrow;