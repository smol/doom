import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface TreeViewProps {
	items : Debug.TreeData[];
	select: (component: JSX.Element) => void;
}

export module Debug {
	export interface TreeData {
		label: string;
		component: JSX.Element;
		children: TreeData[];
	}

	export class TreeView extends React.Component<TreeViewProps, { items: [TreeData[]] }> {
		// private items : [TreeData[]];

		constructor(props: TreeViewProps){
			super(props);

			this.state = { items : [this.props.items] };
			this.select = this.select.bind(this);
		}

		select(item: TreeData, level: number){

			if (item.component !== null){
				console.warn(item.label);
				this.props.select(item.component);
			}

			this.state.items.splice(level + 1, (this.state.items.length - level));

			var items = this.state.items;
			console.warn('items', this.state.items);
			
			if (item.children !== null && item.children.length > 0) {
				items.push(item.children);
				this.setState({ items: items });
			}
		}

		private buildTreeView(items: TreeData[], level: number) : JSX.Element {
			if (items.length === 0){
				return null;
			}

			var i = 0;
			var labels = items.map((item) => {
				return <li key={item.label + i++ } onClick={() => { this.select(item, level) }}>{item.label}</li>;
			});

			return <ul key={ "groups" + level }  className={ "groups " + level}>
				{ labels }
			</ul>; 
		}

		render() {
			var i = 0;
			var treeviews = this.state.items.map(item => {
				return this.buildTreeView(item, i++);
			});

			return <div id="treeview">
				{ treeviews }
			</div>;
		}
	}
}
