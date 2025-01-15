import React, { useEffect } from "react";
import CustomizationPanelMenu from "./Menu/CustomizationPanelMenu";
import BladeShapeCustomizationComponent from "./Components/BladeShapeCustomizationComponent";
import HandleCustomizationComponent from "./Components/HandleCustomizationComponent";
import SheathCustomizationComponent from "./Components/SheathCustomizationComponent";
import FasteningCustomizationComponent from "./Components/FasteningCustomizationComponent";
import BladeCoatingCustomizationComponent from "./Components/BladeCoatingsCustomizationComponent";
import Characteristics from "../Characteristics/Characteristics";
import { useState } from "react";
import EngravingComponent from "../EngravingComponent/EngravingComponent";
import BladeShapeService from "@/app/services/BladeShapeService";
import BladeCoatingService from "@/app/services/BladeCoatingService";
import BladeCoatingColorService from "@/app/services/BladeCoatingColorService";
import SheathColorService from "@/app/services/SheathColorService";
import BladeShape from "@/app/Models/BladeShape";
import BladeCoating from "@/app/Models/BladeCoating";
import SheathColor from "@/app/Models/SheathColor";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";
import HandleColorService from "@/app/services/HandleColorService";
import { useCanvasState } from "@/app/state/canvasState";
import HandleColor from "@/app/Models/HandleColor";
const scrollLeft = () => {
  const container = document.getElementById("scrollContainer");
  container.scrollBy({
    left: -200, // Прокрутка вліво на 200px
    behavior: "smooth",
  });
};

const scrollRight = () => {
  const container = document.getElementById("scrollContainer");
  container.scrollBy({
    left: 200, // Прокрутка вправо на 200px
    behavior: "smooth",
  });
};
const CustomizationPanel = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const bladeShapeService = new BladeShapeService();
  const bladeCoatingService = new BladeCoatingService();
  const handleColors = new HandleColorService();
  const SheathColorservice = new SheathColorService();

  const state = useCanvasState();

  let detailedCoatings;
  useEffect(() => {
    const fetchBladeShapes = async () => {
      try {
        const shapes = await bladeShapeService.getAll();
        const coatings = await bladeCoatingService.getAll();
        const detailedCoatings: {
          coating: BladeCoating;
          color: BladeCoatingColor;
        }[] = [];

        for (const coating of coatings) {
          const detailedCoating = await bladeCoatingService.getById(coating.id);
          detailedCoating.colors.forEach((color: BladeCoatingColor) => {
            detailedCoatings.push({
              coating: detailedCoating,
              color: color,
            });
          });
        }
        const handlecolors = await handleColors.getAll();
        const sheaths = await SheathColorservice.getAll();
        console.log(coatings);

        SelectByDefault(
          shapes[0],
          detailedCoatings[0].coating,
          detailedCoatings[0].color,
          sheaths[0],
          handlecolors[0]
        );
      } catch (error) {
        console.error("Error fetching blade shapes:", error);
      }
    };
    fetchBladeShapes();
  }, []);
  const SelectByDefault = (
    shape: BladeShape,
    coating: BladeCoating,
    coatingcolor: BladeCoatingColor,
    sheath: SheathColor,
    hadleColor: HandleColor
  ) => {
    state.bladeShape = {
      ...state.bladeShape,
      id: shape.id,
      name: shape.name,
      price: shape.price,
      totalLength: shape.totalLength,
      bladeLength: shape.bladeLength,
      bladeWidth: shape.bladeWidth,
      bladeWeight: shape.bladeWeight,
      sharpeningAngle: shape.sharpeningAngle,
      rockwellHardnessUnits: shape.rockwellHardnessUnits,
      engravingLocationX: shape.engravingLocationX,
      engravingLocationY: shape.engravingLocationY,
      engravingLocationZ: shape.engravingLocationZ,
      engravingRotationX: shape.engravingRotationX,
      engravingRotationY: shape.engravingRotationY,
      engravingRotationZ: shape.engravingRotationZ,
      bladeShapeModelUrl: shape.bladeShapeModelUrl,
      sheathModelUrl: shape.sheathModelUrl,
    };
    state.bladeCoating = coating;
    state.bladeCoatingColor = coatingcolor;
    state.handleColor = hadleColor;
    state.sheathColor = sheath;
  };
  const renderContent = () => {
    switch (selectedOption) {
      case "bladeShape":
        return <BladeShapeCustomizationComponent />;
      case "bladeCoating":
        return <BladeCoatingCustomizationComponent />;
      case "handleColor":
        return <HandleCustomizationComponent />;
      case "scabbardColor":
        return <SheathCustomizationComponent />;
      case "attachments":
        return <div>ше не робить</div>;
      case "engraving":
        return <EngravingComponent />;

      default:
        return <div>Виберіть опцію для кастомізації</div>;
    }
  };

  return (
    <div className="customization- flex flex-col h-full bg-gray-800">
      <div className="overflow-x-auto scrollbar-hide"></div>

      <div className="relative">
        {/* Кнопка вліво */}
        <button
          onClick={() => scrollLeft()}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 z-10 rounded-l-md"
        >
          ←
        </button>

        {/* Панель з контентом */}
        <div
          className="overflow-x-auto mx-10 scrollbar-hide flex items-center"
          id="scrollContainer"
        >
          <CustomizationPanelMenu setSelectedOption={setSelectedOption} />
        </div>

        {/* Кнопка вправо */}
        <button
          onClick={() => scrollRight()}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 z-10 rounded-r-md"
        >
          →
        </button>
      </div>

      <div className="customization-content  mt-4 p-4 bg-gray-700 rounded scrollbar-hide flex-1 h-full overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default CustomizationPanel;
