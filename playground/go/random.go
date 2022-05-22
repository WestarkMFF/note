package main

import (
	"fmt"
)

func main() {
	// fmt.Println(time.Now().UnixNano())

	var x, y int

	fmt.Println(&x == &x, &x == &y, &x == nil)

	cond := &x == &x

	if cond {
		fmt.Println("yessss")
	}
}
