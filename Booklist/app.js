// bool class
class Book{
    constructor(title,author,isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }
}



//UI class
class UI{
    static displayBooks(){

        const books=Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book){
        const list=document.querySelector('#book-list');
        const row= document.createElement('tr');
        //Using backtips below (search on google)
        row.innerHTML=`
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }
    static deleteBook(el){
        if(el.classList.contains('delete')){
            //why parentElement 2 times?
            //because 1st will delete td but we have to delete whole row i.e tr so 2 times
            el.parentElement.parentElement.remove();
        }
    }
    
    static showAlert(message,className){
        //create small div for message 
        const div=document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form); //inserting div before form
        //make vanish in 3seconds
        setTimeout(() => document.querySelector('.alert').remove(),2000);

    }


//clearing fields after clicking
    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
    }
}


// Store class:LocalStorage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[];

        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){
        const books =  Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) =>{
            if(book.isbn === isbn){
                books.splice(index,1);
            }

        });

        localStorage.setItem('books',JSON.stringify(books));
    }
}

//Events
document.addEventListener('DOMContentLoaded',UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit',(e)=>{

    e.preventDefault();
    //taking value from inputfield
    
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate all fields are filled
    if(title===''|| author===''||isbn===''){
        UI.showAlert('Please fill all fields','danger');
    }
    else{
        const book = new Book(title, author, isbn);

        //add book
        UI.addBookToList(book);

        //add book to local storage
        Store.addBook(book);

        //while clearing fields show success message that books are added sucessfully
        UI.showAlert('Book Added Successfully','success')

        //clearfields
        UI.clearFields();
    }

});

//event:remove a book

document.querySelector('#book-list').addEventListener('click',(e)=>{
    UI.deleteBook(e.target);

    //Remove book from storage
    //parent is the td 
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //while removing book from local storage show message that book is removed
    UI.showAlert('Book Removed Successfully','success')

    //
});

   
    
    
