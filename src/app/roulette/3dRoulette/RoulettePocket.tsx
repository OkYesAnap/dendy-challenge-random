import React, { useMemo } from 'react';
import { Mesh, Shape, ExtrudeGeometry, MeshStandardMaterial } from 'three';
import { CSG } from 'three-csg-ts';

interface CustomTrapezoidPocketProps {
    position: [number, number, number];
    rotationY: number;
    color: string;
    topWidth?: number;
    bottomWidth?: number;
}

const CustomTrapezoidPocket: React.FC<CustomTrapezoidPocketProps> = ({
                                                                         position,
                                                                         rotationY,
                                                                         color,
                                                                         topWidth = 0.33,
                                                                         bottomWidth = 0.3,
                                                                     }) => {
    const height = 0.15;
    const width = 0.3;
    const wallThickness = 0.04;
    const [xPos, yPos, zPos] = position;

    const trapezoidMesh = useMemo(() => {
        // Функция для создания трапециевидной формы
        const createTrapezoidShape = (widthTop: number, widthBottom: number, depth: number) => {
            const shape = new Shape();

            // Начинаем с левого нижнего угла
            shape.moveTo(widthBottom , -depth );
            // Правая нижняя
            shape.lineTo(-widthBottom , -depth );
            // Правая верхняя
            shape.lineTo(-widthTop , depth );
            // Левая верхняя
            shape.lineTo(widthTop , depth );
            // Замыкаем
            shape.closePath();

            return shape;
        };

        // 1. Внешняя трапециевидная оболочка
        const outerShape = createTrapezoidShape(topWidth, bottomWidth, width);
        const outerGeometry = new ExtrudeGeometry(outerShape, {
            depth: height,
            bevelEnabled: false,
        });

        const outerMesh = new Mesh(outerGeometry);
        // outerMesh.rotation.x = Math.PI / 2;
        outerMesh.updateMatrix();

        // 2. Внутренняя трапециевидная полость
        const innerShape = createTrapezoidShape(
            topWidth - wallThickness * 2,
            bottomWidth - wallThickness * 2,
            width - wallThickness * 2
        );
        const innerGeometry = new ExtrudeGeometry(innerShape, {
            depth: height - wallThickness,
            bevelEnabled: false,
        });

        const innerMesh = new Mesh(innerGeometry);
        innerMesh.position.y = wallThickness / 2; // Центрируем по высоте
        innerMesh.updateMatrix();

        // 3. Булево вычитание
        const csgResult = CSG.subtract(outerMesh, innerMesh);
        csgResult.material = new MeshStandardMaterial({
            color,
            flatShading: true
        });

        return csgResult;
    }, [topWidth, bottomWidth, height, width, wallThickness, color]);

    return (
        <group
            position={[
                xPos + ((topWidth)) * Math.cos(rotationY),
                yPos + height - 0.23,
                zPos - ((topWidth)) * Math.sin(rotationY)
            ]}
            rotation={[0, rotationY + Math.PI/2, 0]}
        >
            <primitive
                object={trapezoidMesh}
                rotation={[Math.PI/2, 0, 0]}
            />
        </group>
    );
};

export default CustomTrapezoidPocket;