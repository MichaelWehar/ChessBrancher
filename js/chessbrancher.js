var game = Chess();
var turn = {};

var onDrop = function(boardName, source, target, piece, newPos, oldPos, newFen, oldFen, orientation){
	if(source == target) return 'snapback';
	if(piece[0] != turn[boardName] && turn[boardName] != "x") return 'snapback';
	
	if(!game.load(oldFen +  " " + piece[0] + " KQkq - 0 1")) return 'snapback';
	var move = game.move({
		from: source,
		to: target,
		promotion: 'q' // NOTE: always promote to a queen for example simplicity
	});

	// illegal move
	if (move === null) return 'snapback';
	
	var possibleMoves = game.moves();
	if (possibleMoves.length === 0) return 'snapback';
	
	var row = document.getElementById("table" + boardName).rows[0];
	var i = row.cells.length;
	var cell = row.insertCell(i);
	var newBoardName = boardName + i;
	
	if(piece[0] == "w") turn[newBoardName] = "b";
	else if(piece[0] == "b") turn[newBoardName] = "w";
	else turn[newBoardName] = "x";
	
	cell.innerHTML = '<br><center><div id="' + newBoardName + '" style="width: 200px"></div></center><br><table id="table' + newBoardName + '" class="table table-bordered table-condensed"><tbody><tr></tr></tbody></table>';
	ChessBoard(newBoardName, {draggable: true, position: game.fen(), onDrop: onDrop});
	
	return 'snapback';
};

var cfg = {
  draggable: true,
  position: 'start',
  onDrop: onDrop
};

ChessBoard('board', cfg);
turn['board'] = "w";

function updateFen(){
	var newFen = document.getElementById("inputFen").value;
	if(newFen == ""){
		newFen = 'start';
		turn['board'] = "w";
	}
	else{
		
		var isWhite = newFen.split(" w");
		var isBlack = newFen.split(" b");
		
		if(isWhite.length > 1) turn['board'] = "w";
		else if(isBlack.length > 1) turn['board'] = "b";
		else turn['board'] = "x";
		
	}
	
	ChessBoard('board', {draggable: true, position: newFen, onDrop: onDrop});
	document.getElementById("firstRow").innerHTML = "";
}

function clickEnter(e){
	if (e.keyCode == 13) {
		updateFen();
    }
}