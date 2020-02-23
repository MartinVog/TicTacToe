var tictactoc = angular.module("TicTacToe", []);

tictactoc.controller('GameController', function ($scope, $timeout) {
    var IATurn = function () {
        var bestScore = null;
        var bestMove = null;

        for (var x = 0; x < $scope.config.SizeX; x++) {
            for (var y = 0; y < $scope.config.SizeY; y++) {
                if (!$scope.config.grid[x][y]) {
                    $scope.config.grid[x][y] = $scope.stateGame.CurrentPlayer.Value;

                    var score = minMax($scope.config.grid, false, 0);

                    if (bestScore === null || score > bestScore) {
                        bestMove = { x, y };
                        bestScore = score;
                    }

                    $scope.config.grid[x][y] = null;
                }
            }
        }

        $timeout(function () {
            if (bestMove)
                $scope.config.grid[bestMove.x][bestMove.y] = $scope.stateGame.CurrentPlayer.Value;

            var winner = checkWinStatique3();

            if (!winner)
                nextTurn();
            else {
                var p_winner = getPlayerByValue(winner);
                $scope.endGame(p_winner);
            }
        }, 1000);
    };

    var _score = { "human": -10, "ia": 10, "tie": 0 };

    var minMax = function (board, isMaximazing, deep) {
        //Protection
        if (deep > 999)
            return null;

        var winner = checkWinStatique3();
        var p_winner = getPlayerByValue(winner);

        if (p_winner) {
            if (_score[p_winner.Type])
                return _score[p_winner.Type];
            else
                return 0;
        }

        var bestScore = 0;

        for (var x = 0; x < $scope.config.SizeX; x++) {
            for (var y = 0; y < $scope.config.SizeY; y++) {

                if (!board[x][y]) {

                    board[x][y] = isMaximazing ? $scope.stateGame.CurrentPlayer.Value : "X";//choisir un signe != que celui de l'ia

                    var score = minMax(board, !isMaximazing, deep + 1);




                    if (score !== null)
                        if (isMaximazing)
                            bestScore = Math.max(score, bestScore);
                        else
                            bestScore = Math.min(score, bestScore);




                    board[x][y] = null;

                }

            }
        }

        return bestScore;
    };









    $scope.setNumberPlayer = function (numberPlayer) {
        $scope.config.IsVersusIA = numberPlayer === 1 ? true : false;
        initPlayers(numberPlayer);
    };

    $scope.startGame = function () {
        var defaultSize = 3;
        var defaultNumerPlayers = 2;

        $scope.data.winner = null;

        initGrid(defaultSize, defaultSize);

        $scope.stateGame = {};
        nextTurn();
    };

    $scope.endGame = function (winner) {
        $scope.data.winner = winner;
        $scope.stateGame = null;
    };

    var nextTurn = function () {
        $scope.stateGame.IsHumanTurn = false;

        if ($scope.stateGame.CurrentPlayerIndex === null)
            $scope.stateGame.CurrentPlayerIndex = 0;
        else
            $scope.stateGame.CurrentPlayerIndex = $scope.stateGame.CurrentPlayerIndex < $scope.config.NumberPlayers - 1 ? $scope.stateGame.CurrentPlayerIndex + 1 : 0;

        $scope.stateGame.CurrentPlayer = $scope.config.Players[$scope.stateGame.CurrentPlayerIndex];

        if ($scope.stateGame.CurrentPlayer.Type === "human")
            // playTurn;
            $scope.stateGame.IsHumanTurn = true;
        else
            IATurn();
    };

    $scope.clickCell = function (x, y) {
        if ($scope.stateGame && $scope.stateGame.IsHumanTurn && !$scope.config.grid[x][y]) {
            $scope.config.grid[x][y] = angular.copy($scope.stateGame.CurrentPlayer.Value);
            $scope.stateGame.HasClick = true;

            var winner = checkWinStatique3();

            $timeout(function () {
                if (!winner)
                    nextTurn();
                else {
                    var p_winner = getPlayerByValue(winner);
                    $scope.endGame(p_winner);
                }
            }, 100);
        }
    };

    var equals3 = function (a, b, c) {
        if (a !== null && a === b && b === c && a === c)
            return true;
        else
            return false;
    };

    var getPlayerByValue = function (value) {

        return _.find($scope.config.Players, function (p) { return p.Value === value; });
    };

    var checkWinStatique3 = function () {
        //vertical
        for (var x = 0; x < $scope.config.SizeX; x++) {
            if (equals3($scope.config.grid[x][0], $scope.config.grid[x][1], $scope.config.grid[x][2]))
                return $scope.config.grid[x][0];
        }

        //horizontal
        for (var y = 0; y < $scope.config.SizeX; y++) {
            if (equals3($scope.config.grid[0][y], $scope.config.grid[1][y], $scope.config.grid[2][y]))
                return $scope.config.grid[0][y];
        }

        //diago 1
        if (equals3($scope.config.grid[0][0], $scope.config.grid[1][1], $scope.config.grid[2][2]))
            return $scope.config.grid[0][0];

        //diago 2
        if (equals3($scope.config.grid[0][2], $scope.config.grid[1][1], $scope.config.grid[2][0]))
            return $scope.config.grid[0][2];

        return null;
    };

    var initGrid = function (sizeX, sizeY) {
        $scope.config.grid = [];

        $scope.config.SizeX = sizeX;
        $scope.config.SizeY = sizeY;

        for (var x = 0; x < sizeX; x++) {
            $scope.config.grid[x] = [];

            for (var y = 0; y < sizeY; y++) {
                $scope.config.grid[x][y] = null;
            }
        }
    };

    var _defaultValue = ["X", "O"];
    var initPlayers = function (numberPlayers) {
        $scope.config.NumberPlayers = numberPlayers;

        $scope.config.Players = [];

        for (var i = 0; i < numberPlayers; i++) {
            $scope.config.Players[i] = {
                Name: _defaultValue[i],
                Value: _defaultValue[i],
                Type: "human"
            };
        }

        if (numberPlayers === 1)//Add IA
        {
            $scope.config.Players[1] = {
                Name: _defaultValue[1],
                Value: _defaultValue[1],
                Type: "ia"
            };

            $scope.config.NumberPlayers++;
        }
    };

    var init = function () {
        $scope.data = {};
        $scope.config = {};
    };
    init();

});