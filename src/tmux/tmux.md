# Introduction to `tmux`

The `tmux` package enables a number of terminals to be created, accessed and contolled from a single screen. Essentially it is a terminal within the terminal it is launched in. 

<div align=center>

![](https://thevaluable.dev/images/2019/tmux_boost/tmux-working-diagram.jpg)

</div>

First off install tmux from the `apt` repository:

```sh
% sudo apt install tmux
```

Once installed, you can launch `tmux` from the terminal you are in:

```sh
$ tmux
```

- To split your window horizonally use `ctrl` + `B` then release both keys and press the `%` key

- To split a window verically use `ctrl` + `B` then release both keys and press the `"` key

- To move about the split panels in a window use `ctrl` + `B` and then release both keys and the directionall arrows on the keyboard, left, right, up and down.


- To close a panel use type:

```sh
$ exit
```