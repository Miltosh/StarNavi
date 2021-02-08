import React, { useState, useEffect } from 'react';
import { FormControl, MenuItem, Select, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';

const useStyles = makeStyles((theme) => ({
    formControl: {
        display: 'block',
        margin: 'auto',
        width: '80%',
        textAlign: 'center',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        margin: 'auto',
    },
    btn: {
        marginLeft: '5%',
    },
}));

function App() {
    const classes = useStyles();

    const [difficultyLevel, setDifficultyLevel] = useState(null);
    const [modes, setModes] = useState('');
    const [history, setHistory] = useState([]);
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        //Getting modes of game
        (async () => {
            let response = await fetch(`https://demo1030918.mockable.io/`);
            let content = await response.json();
            setModes(content); // When received all modes from the request, set it to state
        })();
    }, []);

    const checkDifficulty = () => {
        if (difficultyLevel === 5) {
            return 'easyMode';
        } else if (difficultyLevel === 10) {
            return 'normalMode';
        } else if (difficultyLevel === 15) {
            return 'hardMode';
        }
    };

    const addBlocktoHistory = (index) => {
        let row = Math.ceil(index / difficultyLevel);
        let col = index % difficultyLevel; // If select last col, it be === 0, so we fix it

        if (col === 0) {
            col = difficultyLevel;
        }

        //Set last changes in to the beginning of the array
        setHistory([`Row: ${row}  Col: ${col}`, ...history]);
    };

    const renderField = () => {
        return Array.from({ length: difficultyLevel * difficultyLevel }).map((el, index) => (
            <td className={checkDifficulty()} onMouseOver={() => addBlocktoHistory(index + 1)} key={index} />
        ));
    };
    return (
        <div className="App">
            <FormControl className={classes.formControl}>
                <Select
                    defaultValue=""
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                    displayEmpty
                    disabled={isStarted}
                    className={classes.selectEmpty}
                >
                    <MenuItem value="" disabled>
                        Pick mode
                    </MenuItem>

                    <MenuItem value={modes ? modes.easyMode.field : 0}>Easy Mode</MenuItem>

                    <MenuItem value={modes ? modes.normalMode.field : 0}>Normal Mode</MenuItem>

                    <MenuItem value={modes ? modes.hardMode.field : 0}>Hard Mode</MenuItem>
                </Select>
                <Button
                    onClick={() => setIsStarted(true)}
                    className={classes.btn}
                    variant="contained"
                    color="primary"
                    disabled={isStarted}
                >
                    START
                </Button>

                {/* Render this part only if user press "Start" */}
                {isStarted && (
                    <div className="wrapper">
                        <table>
                            <tbody>
                                <tr>{renderField()}</tr>
                            </tbody>
                        </table>

                        <div className="history">
                            {history.map((el, index) => (
                                <p key={index}>{el}</p>
                            ))}
                        </div>
                    </div>
                )}
            </FormControl>
        </div>
    );
}

export default App;
