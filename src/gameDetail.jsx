import React from 'react';
import Radium from 'radium';
import axios from 'axios';

import GameLineScore from './gameLineScore.jsx';
import GameStat from './gameStat.jsx';

/*
	GameDetail: Request the detailed stat of this particular game to gd2.mlb. Stat will be passed to 
		GameLineScore and GameStat. 
	Parent component: Game
	Child component: GameLineScore, GameStat
*/

class GameDetail extends React.Component {

	constructor(props) {
		super(props);
		/*
			boxscore: An object that is retrieved by requesting to gd2.mlb. All the
				necessary stat to display in this component is in boxscore.
			fetch_fail: Boolean that will set true if ajax failed to fetch. When true,
				render function will render an error message to user.
		*/
		this.state = {
			boxscore: {},
			fetch_fail: false,
		};

	}

	// Call mlb api. Get data and then update current state
	updateContent(p){
		const game = (typeof p === 'undefined') ? this.props.game : p.game;

		// If no game, do not update
		if (typeof game === 'undefined'){
			return
		}

		const game_data_dir = game.game_data_directory;

		var url = `http://gd2.mlb.com${game_data_dir}/boxscore.json`;

		axios.get(url)
			.then((res) => {
				this.setState({boxscore: res.data.data.boxscore, fetch_fail: false});

			})
			.catch((err) => {
				console.log(err);
				// Force render an error message for the user
				this.setState({fetch_fail: true});
			});


	}

	componentDidMount(){
		this.updateContent();
	}

	componentWillReceiveProps(p){
		this.updateContent(p);	
	}

	render(){
		const style = {
			gameDetail: {
				'@media (min-width: 812px)':{
					borderBottom: 'grey solid 1px'
				}
			},
			errorMessage:{
				marginLeft: '10px'
			}
		}
		const boxscore = this.state.boxscore;
		try {
			if (this.state.fetch_fail){
				return (
					<div style={style.gameDetail}>
						<span style={style.errorMessage}> Unable to fetch game detail </span>
					</div>
				)
			}
			return (
					<div style={style.gameDetail}>
						<GameLineScore boxscore={boxscore} />

						<GameStat boxscore={boxscore} />

					</div>
			)
		}
		catch(err){
			// This is probably due to the fact that props hasnt populated yet
			return (
				<div>
					Loading
				</div>
				);
		}
		
	}

}

export default Radium(GameDetail);