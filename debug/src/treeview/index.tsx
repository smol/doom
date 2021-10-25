import { Link } from "react-router-dom";
import styled from "styled-components";
import { useRouteMatch, useLocation, Switch, Route } from "react-router-dom";
import treedata from "../actions/treedata";

export interface TreeViewProps {
  items?: TreeData[];
}

export interface TreeData {
  label: string;
  url: string;
  children: TreeData[];
  Component?: () => JSX.Element;
}

const Ul = styled.ul`
  margin: 0;
  display: block;
  vertical-align: top;
  padding: 0;
  list-style: none;
`;

const Container = styled.div`
  background: #616161;
  box-sizing: border-box;
  overflow: auto;
  width: 150px;
  padding: 0 10px;
`;

const Li = styled.li`
  > a {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    color: #424242;
    text-decoration: none;
    display: block;
    padding: 5px;
    border-bottom: 1px solid #cdcdcd;
    background: #e7e7e7;
    margin: 5px 0;
    border-radius: 2px;
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
  }
`;

export const TreeView = ({ items }: TreeViewProps) => {
  const location = useRouteMatch();
  const { url } = location;

  const buildTreeView = (items: TreeData[]): JSX.Element => {
    return (
      <Ul style={{}}>
        {items.map((item, index) => (
          <Li key={`${item.label}${index}`}>
            <Link to={`${url}/${item.url}`}>{item.label}</Link>
          </Li>
        ))}
      </Ul>
    );
  };

  return (
    <>
      <Container>{buildTreeView(items)}</Container>
      <Switch>
        <Route
          path={`${url}/:item`}
          render={({ match }) => {
            const { params } = match;
            if (!items || items.length === 0) return null;

            const { children } = items.find((item) => item.url === params.item);
            if (!children || children.length === 0) {
              return null;
            }

            return <TreeView items={children} />;
          }}
        ></Route>
      </Switch>
    </>
  );
};
