"use client"
import {
    CylinderGeometry,
    ConeGeometry,
    Mesh,
    MeshStandardMaterial,
} from "three";
import {useSelector} from "react-redux";
import {slotsList as sSlotsList} from "@/redux/slices/gamesSlice";

function PulsingArrow() {
    const allGamesList = useSelector(sSlotsList);

    const height = allGamesList.length * 0.1 - .2;
    const maxLength = Math.max(...allGamesList.map(slot => slot.formattedValue.length));
    const additionalHeight = maxLength * 0.1 + .5;

    return (
        <group position={[0, additionalHeight/2 - 0.5, 0]}>
            <primitive
                object={new Mesh(
                    new CylinderGeometry(0.4, 0.4, 2.5, 16),
                    new MeshStandardMaterial({
                        color: "#2c3e50",
                        metalness: 0.3,
                        roughness: 0.7
                    })
                )}
            />
            <group position={[0, 1, 0]} rotation={[0, -Math.PI/2, 0]}>
                <primitive
                    object={new Mesh(
                        new CylinderGeometry(0.06, 0.06, height , 8),
                        new MeshStandardMaterial({
                            color: "#f1c40f",
                            emissive: "#f39c12",
                            emissiveIntensity: 0.3
                        })
                    )}
                    position={[height/2, 0, 0]}
                    rotation={[0, 0, Math.PI / 2]}
                />

                <primitive
                    object={new Mesh(
                        new ConeGeometry(0.12, 0.3, 8),
                        new MeshStandardMaterial({
                            color: "#e74c3c",
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