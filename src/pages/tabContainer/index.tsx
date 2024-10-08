import React, { useEffect, useRef, useState } from "react";
import PropertyList from "@/components/PropertyGroup";
import TabContainer from "../../../lib/tabContainer/tabContainer";

const TabContainerTest: React.FC = () => {
  const compContainerRef = useRef<HTMLDivElement | null>(null);
  const compRef = useRef<any>(null);
  const [defaultData, setDefaultData] = useState<string>("");
  const [propertyDic, setPropertyDic] = useState([]);
  const [property, setProperty] = useState({});

  const updateProperty = (name: string, value: any) => {
    if (compRef.current) {
      compRef.current.setProperty(name, value);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDefaultData(e.target.value);
  };

  const updateData = () => {
    if (compRef.current) {
      compRef.current.update(JSON.parse(defaultData));
    }
  };

  const addPanel = () => {
    if (compRef.current) {
      compRef.current.addPanel();
      console.log(compRef.current.property, "propertyList");
      console.log(compRef.current.propertyDictionary, "PropertyDictionary");
    }
  };

  const deletePanel = () => {
    if (compRef.current) {
      compRef.current.deletePanel(0);
      console.log(compRef.current.property, "propertyList");
      console.log(compRef.current.propertyDictionary, "PropertyDictionary");
    }
  };

  useEffect(() => {
    if (compContainerRef.current) {
      compRef.current = new TabContainer(
        "asd",
        "asd",
        compContainerRef.current,
        0,
        {
          property: {
            basic: {
              frame: [0, 0, 900, 800],
            },
          },
        },
        true
      );
      setPropertyDic(compRef.current.propertyManager.getPropertyDictionary());
      setProperty(compRef.current.propertyManager.getPropertyList());
      setDefaultData(JSON.stringify(compRef.current.defaultData));
    }
  }, []);

  return (
    <div>
      TabContainer组件测试
      <div className="comp_prop">
        <div className="comp_container" ref={compContainerRef}></div>
        <div className="prop_container">
          <PropertyList property={property} propertyDic={propertyDic} updateProperty={updateProperty} />
        </div>
      </div>
      <div className="comp_data">
        <textarea className="data_area" defaultValue={defaultData} onChange={handleTextareaChange}></textarea>
        <button onClick={updateData}>update data</button>
        <button onClick={addPanel}>add panel</button>
        <button onClick={deletePanel}>delete panel</button>
      </div>
    </div>
  );
};

export default TabContainerTest;
