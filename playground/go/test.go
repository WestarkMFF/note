package main

import "fmt"

func swap(a, b string) (string, string) {
	return a, b
}

func main() {

	a, b := swap("hello", "world")
	fmt.Println(a, b)

	fmt.Println("test")
}
