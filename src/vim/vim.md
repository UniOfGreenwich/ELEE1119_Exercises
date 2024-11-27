# vim

Vim (Vi IMproved) is a highly configurable text editor designed for efficient text editing. It is an enhanced version of the original Unix editor Vi, with many additional features. Vim is known for its powerful capabilities, flexibility, and steep learning curve.

## Key features: 

1. **Modes**: Vim operates in several modes, the most common being:
    - **Normal Mode**: For navigating and manipulating text. <kbd>ESC</kbd>
    - **Insert Mode**: For inserting text. In **Normal** mode press <kbd>i</kbd>
    - **Visual Mode**: For selecting and manipulating text. In **Normal** mode press <kbd>shift</kbd>+<kbd>v</kbd>
    - **Command-Line Mode**: For running Vim commands and configuring settings. In **Normal** mode press <kbd>shift</kbd>+<kbd>:</kbd>

2. **Keyboard-Based Editing**: Vim is designed to be used primarily with the keyboard, allowing for rapid and precise text manipulation without needing a mouse. This makes editing fast and efficient once the commands are mastered.

3. **Customizability**: Vim can be heavily customized using configuration files (.vimrc). Users can set their own key mappings, create macros, and install plugins to extend Vim’s functionality.

4. **Extensibility**: Vim supports plugins, which can add new features such as syntax highlighting, code completion, file browsing, and version control integration. Popular plugin managers like Vim-Plug or Pathogen make it easy to install and manage these plugins.

5. **Powerful Search and Replace**: Vim offers robust search and replace functionality with support for regular expressions, allowing complex text manipulation tasks to be performed with ease.

6. **Multiple Buffers, Windows, and Tabs**: Vim supports working with multiple files in a single session using buffers (files in memory), split windows (multiple views in the same window), and tabs (multiple editing sessions).

7. **Lightweight and Portable**: Vim is lightweight and can run in a terminal or graphical user interface (GUI), making it suitable for use on remote servers or local machines. It is available on most Unix-like systems, as well as on Windows and macOS.

8. **Wide Language Support**: Vim supports syntax highlighting and editing features for many programming languages, making it a popular choice among programmers and system administrators.

## Why Use Vim?

- **Efficiency**: Once you learn Vim's commands and shortcuts, you can navigate and edit text much faster than with a standard text editor.

- **Customizability**: It can be tailored to fit personal workflows and preferences.

- **Versatility**: Suitable for a wide range of tasks, from simple text editing to complex programming projects.

- **Community and Support**: Vim has a large, active community and extensive documentation and resources available online.

## Learning Curve

Vim has a reputation for having a steep learning curve, primarily due to its modal nature and reliance on keyboard shortcuts. However, the time invested in learning Vim can pay off in terms of increased productivity and efficiency in text editing.


## Using vim:



## Simple config to make life easier:

You can make a presistent changes to vim using a config file, while we are not using all the features like my system we can make a mini one here that does not depend on 3rd party packages.

~~~admonish terminal

```sh
$ vim ~/.vimrc
```

~~~

Start off by presistently setting number and relavtivenumber:

~~~admonish terminal

```sh
set number
set relativenumber
```

~~~

Then go to command mode by pressing <kbd>shift</kbd>+<kbd>:</kbd> and type `source %` and this will live reload the current config. This is because the current session had no config when vim was invoked. You will not have do this again as it `.vimrc` is sourced when vim is invoked.

You can add more features and functionality like below:

~~~admonish code collapsible=true title='Code: Basic config [67 lines]...'
```vim
" Enable line numbers
set number

" Enable relative line numbers for easier navigation
set relativenumber

" Enable syntax highlighting
syntax on

" Enable auto-indentation and smart indentation
set autoindent
set smartindent

" Set tabs and indentation
set tabstop=4       " Number of spaces that a <Tab> counts for
set shiftwidth=4    " Number of spaces to use for each step of (auto)indent
set expandtab       " Convert tabs to spaces

" Enable incremental search
set incsearch

" Enable search highlighting and ignore case by default
set hlsearch
set ignorecase
set smartcase       " Override 'ignorecase' if search pattern contains uppercase

" Show matching brackets
set showmatch

" Set a more user-friendly status line
set laststatus=2

" Enable line wrapping and set wrap options
set wrap
set linebreak

" Set file encoding
set encoding=utf-8

" Better command-line completion
set wildmenu

" Enable persistent undo so you can undo changes after closing and reopening files
set undofile

" Allow backspacing over everything in insert mode
set backspace=indent,eol,start

" Show incomplete commands in the status line
set showcmd

" Disable audible bell and enable visual bell instead
set noerrorbells
set visualbell

" Improve the command-line experience
set cmdheight=2

" Remember the last editing position
au BufReadPost * if line("'\"") > 0 && line("'\"") <= line("$") | exe "normal! g'\"" | endif

" Display whitespace characters (tabs, trailing spaces)
set list
set listchars=tab:>-,trail:·

" Auto save before losing focus or exiting Vim
autocmd FocusLost,WinLeave * silent! wa
```

~~~
