import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { TreeData } from "./treeview";

const Div = styled.div`
  background: #292929;
  height: 100vh;
  overflow: auto;
  flex: 1;
`;

export const Viewer = ({ items }: { items: TreeData[] }) => {
  const { pathname } = useLocation();

  const itemUrls = pathname
    .split("/")
    .filter((path) => path.length > 0 && path !== "debug");

  const getItem = (itemsUrls: string[], items: TreeData[]): TreeData => {
    const partUrl = itemUrls.shift();
    const temp = items.find(({ url }) => partUrl === url);
    if (temp == null) {
      return null;
    }

    if (itemUrls.length > 0 && temp.children && temp.children.length > 0) {
      return getItem(partUrl, temp.children);
    }

    return temp;
  };

  const item = getItem(itemUrls, items);

  console.info({ itemUrls, item });

  return (
    <Div>
      {item && item.Component && item.Component()}
      {/* {items.map(({ url, Component }) => (Component ? <Component /> : null))} */}
    </Div>
  );
};
