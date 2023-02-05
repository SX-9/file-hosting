let arr = [{
	id: '1',
	pass: 'password1'
}, {
	id: '2',
	pass: 'password2'
}, {
	id: '3',
	pass: 'password3'
}];
let idToDelete = '2';
console.log(arr)
arr = arr.filter(item => item.id !== idToDelete);
console.log(arr)
