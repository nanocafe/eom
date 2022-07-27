function getPagination(table) {

    $('#maxRows').on('change', function () {

        $('.pagination').html('');						// reset pagination div
        let trnum = 0;									// reset tr counter 
        let maxRows = parseInt($(this).val());			// get Max Rows from select option
        let totalRows = $(table + ' tbody tr').not(".invalid-result").length; // Get total rows
        $(table + ' tbody tr').not(".invalid-result").each(function(i) {
            trnum++;                                    // counter
            trnum > maxRows ? $(this).hide() : $(this).show() // if tr number gt maxRows fade it out else fade in
        });											//  was fade out to fade it in 
        if (totalRows > maxRows) {						// if tr total rows gt max rows option
            let pagenum = Math.ceil(totalRows / maxRows);	// ceil total(rows/maxrows) to get ..  
            //	numbers of pages 
            for (let i = 1; i <= pagenum;) {			// for each page append pagination li 
                $('.pagination').append('<li data-page="' + i + '">\
                                  <span>'+ i++ + '<span class="sr-only">(current)</span></span>\
                                </li>').show();
            }
        }                                               // end if row count > max rows
        
        $('.pagination li:first-child').addClass('active'); // add active class to the first li 
        
        showig_rows_count(maxRows, 1, totalRows);           //SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT
        
        $('.pagination li').on('click', function (e) {		// on click each page
            e.preventDefault();
            let pageNum = $(this).attr('data-page');	// get it's number
            let trIndex = 0;							// reset tr counter
            $('.pagination li').removeClass('active');	// remove active class from all li 
            $(this).addClass('active');					// add active class to the clicked 

            showig_rows_count(maxRows, pageNum, totalRows); //SHOWING ROWS NUMBER OUT OF TOTAL

            $(table + ' tbody tr').not(".invalid-result").each(function () {		// each tr in table
                trIndex++;								// tr index counter 
                // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
                if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
                    $(this).hide();
                } else { $(this).show(); } 				//else fade in 
            }); 										// end of for each tr in table
        });										// end of on click pagination list
    });
    // end of on select change 
    // END OF PAGINATION 
}

//ROWS SHOWING FUNCTION
function showig_rows_count(maxRows, pageNum, totalRows) {
    //Default rows showing
    let end_index = maxRows * pageNum;
    let start_index = ((maxRows * pageNum) - maxRows) + parseFloat(1);
    let string = `Showing ${start_index} to ${end_index > totalRows ? totalRows : end_index } of ${totalRows} entries`;
    $('.rows_count').html(string);
}

// All Table search script
function FilterkeyWord_all_table(table) {
    // Count td if you want to search on all table instead of specific column
    // Declare variables
    let input, filter, tr, td, i;
    input = document.getElementById("search_input_all");
    let input_value = document.getElementById("search_input_all").value;
    filter = input.value.toLowerCase();
    if (input_value != '') {
        // Loop through all table rows, and hide those who don't match the search query
        Array.prototype.slice.call(document.getElementById(table).querySelector("tbody").getElementsByTagName("tr")).forEach(tr => {
            let flag = 0;
            Array.prototype.slice.call(tr.getElementsByTagName("td")).forEach(td => {
                if (td.innerText.toLowerCase().indexOf(filter) > -1) flag = 1;
            })
            if (flag == 1) {
                tr.classList.add("valid-result")
                tr.classList.remove("invalid-result")
            } else {
                tr.classList.remove("valid-result")
                tr.classList.add("invalid-result")
            }
        })
    } else {
        //RESET TABLE
        Array.prototype.slice.call(document.getElementById(table).querySelector("tbody").getElementsByTagName("tr")).forEach(tr => {
            tr.classList.remove("valid-result")
            tr.classList.remove("invalid-result")
        })
    }
    $('#maxRows').trigger('change');
}


loadGuessesTable()
