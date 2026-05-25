import {
    useSharedValue,
    withSpring,
    useAnimatedStyle,
    useAnimatedReaction,
    runOnJS,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";

const SPRING_CONFIG = {
    damping: 18,
    stiffness: 150,
    mass: 0.6,
};

export const useDraggableItem = ({
    id,
    index,
    totalCount,
    positions,
    activeId,
    totalOffset,
    onDragStart,
    onDragEnd,
}) => {
    // Вычисляем начальный индекс без NaN
    const initialIdx = positions.value[id] !== undefined ? positions.value[id] : index;

    const top = useSharedValue(initialIdx * totalOffset);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(1);
    const isDragging = useSharedValue(false);
    const startY = useSharedValue(0);

    // Следим за изменениями позиций (для перемещения соседей)
    useAnimatedReaction(
        () => positions.value[id],
        (currentIdx) => {
            if (currentIdx !== undefined && !isDragging.value) {
                top.value = withSpring(currentIdx * totalOffset, SPRING_CONFIG);
            }
        },
        [id, totalOffset],
    );

    const panGesture = Gesture.Pan()
        .onStart(() => {
            isDragging.value = true;
            activeId.value = id;
            startY.value = positions.value[id] * totalOffset;

            scale.value = withSpring(1.04, SPRING_CONFIG);
            zIndex.value = 999;

            if (onDragStart) runOnJS(onDragStart)();
        })
        .onUpdate((event) => {
            const currentTop = startY.value + event.translationY;
            top.value = currentTop;

            // Рассчитываем потенциальный новый индекс плашки
            const newIdx = Math.min(
                Math.max(Math.round(currentTop / totalOffset), 0),
                totalCount - 1,
            );

            const currentIdx = positions.value[id];

            // Находим соседа и меняемся местами прямо в Shared Value
            if (newIdx !== currentIdx) {
                const updatedPositions = { ...positions.value };

                for (const key in updatedPositions) {
                    if (updatedPositions[key] === newIdx) {
                        updatedPositions[key] = currentIdx;
                        break;
                    }
                }

                updatedPositions[id] = newIdx;
                positions.value = updatedPositions;
            }
        })
        .onFinalize(() => {
            const finalIdx = positions.value[id];

            top.value = withSpring(finalIdx * totalOffset, SPRING_CONFIG);
            scale.value = withSpring(1, SPRING_CONFIG);
            zIndex.value = 1;
            isDragging.value = false;
            activeId.value = null;

            if (onDragEnd) {
                runOnJS(onDragEnd)(index, finalIdx);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        position: "absolute",
        left: 0,
        right: 0,
        top: top.value,
        transform: [{ scale: scale.value }],
        zIndex: zIndex.value,
    }));

    return {
        panGesture,
        animatedStyle,
    };
};
