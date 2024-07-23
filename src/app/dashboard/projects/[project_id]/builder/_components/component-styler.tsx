import Card from "@/components/Card";
import Dropdown from "@/components/Dropdown";
import {
    Component,
    fontAligns,
    fontWeights,
    headingFontSizes,
    paragraphFontSizes,
} from "@/types/content";

export default function ComponentStyler({
    selectedComponent,
    onStyleChange,
}: {
    selectedComponent: Component | null;
    onStyleChange: (newData: Component) => void;
}) {
    function saveFontSize(index: number) {
        if (selectedComponent) {
            let newData = selectedComponent;
            if (newData.style) {
                newData.style.fontSize = index;
            } else {
                newData.style = {
                    fontSize: index,
                };
            }
            onStyleChange(newData);
        }
    }
    function saveFontWeight(index: number) {
        if (selectedComponent) {
            let newData = selectedComponent;
            if (newData.style) {
                newData.style.fontWeight = index;
            } else {
                newData.style = {
                    fontWeight: index,
                };
            }
            onStyleChange(newData);
        }
    }
    function saveFontAlign(index: number) {
        if (selectedComponent) {
            let newData = selectedComponent;
            if (newData.style) {
                newData.style.fontAlign = index;
            } else {
                newData.style = {
                    fontAlign: index,
                };
            }
            onStyleChange(newData);
        }
    }

    return (
        <>
            {selectedComponent && selectedComponent.type !== "image" && (
                <Card>
                    <h1 className="font-bold text-lg mb-2">Styles</h1>
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <h2>Font Size:</h2>
                        {selectedComponent.type == "heading" && (
                            <Dropdown
                                dropdownList={headingFontSizes}
                                defaultSelectedElement={
                                    selectedComponent.style?.fontSize !==
                                    undefined
                                        ? headingFontSizes[
                                              selectedComponent.style.fontSize
                                          ]
                                        : headingFontSizes[2]
                                }
                                onChangeIndex={(index) => saveFontSize(index)}
                            />
                        )}
                        {(selectedComponent.type == "paragraph" ||
                            selectedComponent.type == "list") && (
                            <Dropdown
                                dropdownList={paragraphFontSizes}
                                defaultSelectedElement={
                                    selectedComponent.style?.fontSize !==
                                    undefined
                                        ? paragraphFontSizes[
                                              selectedComponent.style.fontSize
                                          ]
                                        : paragraphFontSizes[1]
                                }
                                onChangeIndex={(index) => saveFontSize(index)}
                            />
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center mt-4">
                        <h2>Font Weight:</h2>
                        <Dropdown
                            dropdownList={fontWeights}
                            defaultSelectedElement={
                                selectedComponent.style?.fontWeight !==
                                undefined
                                    ? fontWeights[
                                          selectedComponent.style.fontWeight
                                      ]
                                    : fontWeights[
                                          selectedComponent.type == "heading"
                                              ? 2
                                              : 1
                                      ]
                            }
                            onChangeIndex={(index) => saveFontWeight(index)}
                        />
                    </div>
                    {selectedComponent.type !== "list" && (
                        <div className="grid grid-cols-2 gap-4 items-center mt-4">
                            <h2>Font Align:</h2>
                            <Dropdown
                                dropdownList={fontAligns}
                                defaultSelectedElement={
                                    selectedComponent.style?.fontAlign !==
                                    undefined
                                        ? fontAligns[
                                              selectedComponent.style.fontAlign
                                          ]
                                        : fontAligns[
                                              selectedComponent.type ==
                                              "heading"
                                                  ? 1
                                                  : 0
                                          ]
                                }
                                onChangeIndex={(index) => saveFontAlign(index)}
                            />
                        </div>
                    )}
                </Card>
            )}
        </>
    );
}
