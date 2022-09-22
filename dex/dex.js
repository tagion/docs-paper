const fs = require("fs");
const ejs = require('ejs');
//var filename = "./index.html";
const latex_table = fs.readFileSync("latex_table.ejs", "utf8");
const empty="-";
const ex_decimal=4;
const size_decimal=2;

/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */
function Random(seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
Random.prototype.next = function () {
  return this._seed = this._seed * 16807 % 2147483647;
};


/**
 * Returns a pseudo-random floating point number in range [0, 1).
 */
Random.prototype.nextFloat = function (opt_minOrMax, opt_max) {
  // We know that result of next() will be 1 to 2147483646 (inclusive).
  return (this.next() - 1) / 2147483646;
};

//
// Trade-queue generate table
//
const get_toq=function(list, option) {
    let toq_table=[];
    option=option || {};
//    option.match=option.match || false;
    toq_table.format="|r|c|r|r|r|r|r|p{2cm}|p{2cm}|r|";
    let header=[];
    header.push("No");
    header.push("Type");
    header.push("Size");
    header.push("$P$");
    header.push("$Q$");
    header.push("$E_{ask}$");
    header.push("$E_{bid}$");
//    if ( option.match ) {
    header.push("Bought");
    header.push("Sold");
    header.push("Id");

//    }

    toq_table.push(header);
    list.forEach(function(order) {
        let row=[];
        if ( (typeof option.done === 'undefined') || ( option.done === order.done ) ) {
            row.push(order.no);
            const ask=(order.type === 'ATO');
            row.push(order.type);
            if ( ask ) {
                row.push(order.size.toString()+"TGS");
            }
            else {
                row.push(order.size.toString()+"ACL");
            }
            row.push(order.P);
            row.push(order.Q);
            row.push(order.Eask.toFixed(ex_decimal));
            row.push(order.Ebid.toFixed(ex_decimal));
            if ( order.bought ) {
                if ( ask ) {
                    row.push(order.bought.toFixed(size_decimal)+"TGS");
                }
                else {
                    row.push(order.bought.toFixed(size_decimal)+"ACL");
                }
            }
            else {
                row.push("  ");
            }
            if ( order.sold ) {
//                if ( order.sold ) {
                if ( ask ) {
                    row.push(order.sold.toFixed(size_decimal)+"TGS");
                }
                else {
                    row.push(order.sold.toFixed(size_decimal)+"ACL");
                }
            }
            else {
                row.push("  ");
            }
            if ( order.id ) {
                row.push(order.id);
            }
            else {
                row.push("  ");
            }
            toq_table.push(row);
        }
    });
    return toq_table;
}

//
// ATO Sales list
//
const get_sales=function(list, done) {
    let sales_tabel=[];
    sales_table.format="|r|c|r|r|r|r|p{2cm}|p{2cm}|r|";
    let header=[];
    header.push("No");
    header.push("Type");
    header.push("Size");
    header.push("$P$");
    header.push("$Q$");
    header.push("$E_{ask}$");
    header.push("$E_{bid}$");
    header.push("Sold");
    header.push("Bought");
    header.push("Id");
    sales_table.push(header);
    list.forEach(function(order) {
        let row=[];
        if ( (typeof done === 'undefined') || ( done === order.done ) ) {
            row.push(order.no);
            const ask=(order.type === 'ATO');
            row.push(order.type);
            if ( ask ) {
                row.push(order.size.toString()+"TGS");
            }
            else {
                row.push(order.size.toString()+"ACL");
            }
            row.push(order.P);
            row.push(order.Q);
            row.push(order.Eask.toFixed(ex_decimal));
            row.push(order.Ebid.toFixed(ex_decimal));
            row.push(order.sold);
            sales_table.push(row);
        }
    });
    return sales_table;
}


const ask=function(size, P, Q, no) {
    return {
        type : "ATO",
        done : false,
        sold : 0,
        P : P, // price in TGS
        Q : Q, // price in ACL
        size : size, // size in ACL
        no : no,
        id : 0
    };
}

const bid=function(size, P, Q, no) {
    return {
        type : "BTO",
        done : false,
        sold : 0,
        P : P, // price in TGS
        Q : Q, // price in ACL
        size : size, // size in TGS
        no : no,
        id : 0
    };
}

const random=new Random(12345);

const rand=function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(random.nextFloat(0,1) * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

//
// Trade-order-queue
//
let toq=[];
const N=36;

//
for(let i=0; i<N; i++) {
    let order;
    if ( random.nextFloat(0,1) < 0.5 ) {
        const size=rand(1, 100);
        const P=rand(100, 150);
        const Q=rand(10, 15);
        order=ask(size, P, Q, i);
    }
    else {
        const size=rand(10, 1000);
        const P=rand(100, 150);
        const Q=rand(10, 15);
        order=bid(size, P, Q, i);
    }
    // Exchange rate
    order.Eask=order.Q/order.P;
    order.Ebid=order.P/order.Q;
    toq.push(order);
}


//console.log(JSON.stringify(toq, null, "  "));

let ask_sales=[];
let bid_sales=[];
toq.forEach(function(order) {
    if ( order.type === "ATO" ) {
        ask_sales.push(order);
    }
    else {
        bid_sales.push(order);
    }
});

// Compare exchange rate
const ask_rate_compare=function(a, b) {
    return a.Eask - b.Eask;
}

const bid_rate_compare=function(a, b) {
    return a.Ebid - b.Ebid;
}

// Sort the ask-sales list
ask_sales.sort(bid_rate_compare);

// Sort the bid-sales list
bid_sales.sort(ask_rate_compare);


let text;
//
// Trading-queue table in latex
//
text=ejs.render(latex_table, {table: get_toq(toq, {})});
fs.writeFileSync('toq_table.tex', text);

//
// Ask-Sales list table in latex
//
text=ejs.render(latex_table, {table: get_toq(ask_sales)});
fs.writeFileSync('ask_sales_table.tex', text);

//
// Bid-Sales list table in latex
//
text=ejs.render(latex_table, {table: get_toq(bid_sales)});
fs.writeFileSync('bid_sales_table.tex', text);


let match=[];
//
// Matching and Price discovery
//
let id=0;
toq.forEach(function(buyer, index) {
//    console.log("index=%d", index);
    if ( !buyer.done ) {
        if ( buyer.type === 'ATO' ) {
            bid_sales.every(function(seller, jdex) {
                if ( !seller.done ) {
                    if ( ask_rate_compare(buyer, seller) >= 0 ) {
                        id++;
                        const seller_in_buyer_size=seller.Eask*seller.size;
                        const buyer_size_sold=Math.min(buyer.size, seller_in_buyer_size);
                        buyer.done=true;
                        buyer.id=id;
                        seller.done=true;
                        seller.id=id;

                        buyer.bought=buyer_size_sold;
                        const seller_size_sold=seller.Ebid*buyer_size_sold;
                        if ( seller_size_sold < seller.size ) {
                            seller.sold=seller_size_sold;
                        }
                        else {
                            seller.sold=seller.size;
                        }
//                        console.log("ATO[%d] id=%d buyer.no=%d seller.no=%d", jdex, id, buyer.no, seller.no);
                        match.push({ buyer : buyer, seller : seller});
                        return false;
                    }
                }
                return true;
            });
        }
        else {
            ask_sales.every(function(seller, jdex) {
                if ( !seller.done ) {
                    if ( bid_rate_compare(buyer, seller) >= 0 ) {
                        id++;
                        const seller_in_buyer_size=seller.Ebid*seller.size;
                        const buyer_size_sold=Math.min(buyer.size, seller_in_buyer_size);
                        buyer.done=true;
                        buyer.id=id;
                        seller.done=true;
                        seller.id=id;

                        buyer.bought=buyer_size_sold;
                        const seller_size_sold=seller.Eask*buyer_size_sold;
                        if ( seller_size_sold < seller.size ) {
                            seller.sold=seller_size_sold;
                        }
                        else {
                            seller.sold=seller.size;
                        }
//                        console.log("BTO[%d] id=%d buyer.no=%d seller.no=%d", jdex, id, buyer.no, seller.no);
                        match.push({ buyer : buyer, seller : seller});
                        return false;
                    }
                }
                return true;
            });
        }
    }
});

/*
console.log("ASK list");
ask_sales.forEach(function(order) {
    if ( !order.done ) {
        console.log("%j", order);
    }
});
console.log("BID list");
bid_sales.forEach(function(order) {
    if ( !order.done ) {
        console.log("%j", order);
    }
});
console.log("TOQ list");
toq.forEach(function(order) {
    if ( !order.done ) {
        console.log("%j", order);
    }
});
console.log("Trade list");
toq.forEach(function(order) {
    if ( order.done ) {
        console.log("%j", order);
    }
});
*/




//
// Trading-queue not executed
//
text=ejs.render(latex_table, {table: get_toq(toq, { done : false})});
fs.writeFileSync('toq_table_rest.tex', text);

//
// Trading-queue executed
//
text=ejs.render(latex_table, {table: get_toq(toq, { done : true})});
fs.writeFileSync('toq_table_executed.tex', text);

//
// Ask-Sales not executed list table in latex
//
text=ejs.render(latex_table, {table: get_toq(ask_sales, { done : false})});
fs.writeFileSync('ask_sales_table_rest.tex', text);

//
// Bid-Sales not executed list table in latex
//
text=ejs.render(latex_table, {table: get_toq(bid_sales, { done : false})});
fs.writeFileSync('bid_sales_table_rest.tex', text);



//
// Ask-Sales executed list table in latex
//
text=ejs.render(latex_table, {table: get_toq(ask_sales, { done : true})});
fs.writeFileSync('ask_sales_table_executed.tex', text);

//
// Bid-Sales executed list table in latex
//
text=ejs.render(latex_table, {table: get_toq(bid_sales, { done : true})});
fs.writeFileSync('bid_sales_table_executed.tex', text);


const get_match=function(match) {
    let table=[];
//    option.match=option.match || false;
    table.format="|c|c|c|c|c|c|c|c|c|c|";
    let header=[];

    header.push("Buyer $\\rightarrow$ Seller");
    header.push("No $\\rightarrow$ No");
    header.push("$E_{buyer}$");
    header.push("$E_{seller}$");
    header.push("Bought");
    header.push("Sold");
    header.push("Id");
    table.push(header);
    match.forEach(function(pair) {
        let rows=[];
        rows.push(pair.buyer.type+"$\\rightarrow$"+pair.seller.type);
        rows.push(pair.buyer.no+"$\\rightarrow$"+pair.seller.no);
        const ask=(pair.buyer.type === 'ATO');
        if ( ask ) {
            rows.push(pair.buyer.Eask.toFixed(ex_decimal));
            rows.push(pair.seller.Eask.toFixed(ex_decimal));
            rows.push(pair.buyer.bought.toFixed(size_decimal)+"TGS");
            rows.push(pair.seller.sold.toFixed(size_decimal)+"ACL");
        }
        else {
            rows.push(pair.buyer.Ebid.toFixed(ex_decimal));
            rows.push(pair.seller.Ebid.toFixed(ex_decimal));
            rows.push(pair.buyer.bought.toFixed(size_decimal)+"ACL");
            rows.push(pair.seller.sold.toFixed(size_decimal)+"TGS");
        }
        rows.push(pair.buyer.id);
        table.push(rows);
    });
    return table;
}

//
// Matching pair
//
text=ejs.render(latex_table, {table: get_match(match)});
fs.writeFileSync('matching_pairs.tex', text);
