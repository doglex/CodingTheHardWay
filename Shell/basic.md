# 参考
+ https://zhuanlan.zhihu.com/p/65106362
+ https://www.zhihu.com/question/387878326


# 技巧
+ 复杂的逻辑，能不用shell就不用shell, 改用其他编程工具
+ 如果必须用shell，建议用插件做语法检查
+ 失败即退出在开头写 set -e   (他默认竟然是不退出的， 特殊行上临时忽略可以用 || true )
+ 显示执行过程 set -x  (或执行时 sh -x test.sh)
+ 变量必须定义 set -u
+ 管道命令需要及时失败 set -o
+ 变量初始化后阻止修改 readonly MY_PATH=/usr/bin
+ 变量设置默认值 name=${1:-shouwang}
+ 多条命令后者执行依赖前者成功 cmd0 && cmd1 && cmd1

# 传参
```
/home/shouwang/test.sh para1 para2 para3
$0 $1 $2 $3
脚本名 第一个参数 第二个参数 第三个参数

$# 代表脚本后面跟的参数个数，前面的例子中有3个参数
$@ 代表了所有参数，并且可以被遍历
$*代表了所有参数，且作为整体，和$*很像，但是有区别
$$ 代表了当前脚本的进程ID
$?代表了上一条命令的退出状态
```

# 变量定义
给变量赋值，使用等号即可，但是等号两边千万不要有空格，等号右边有空格的字符串也必须用引号引起来：
```
para1="hello world"#字符串直接赋给变量para1
unset用于取消变量。例如：
unset para1
如何使用变量呢？使用变量时，需要在变量前加$，例如要打印前面para1的内容：
echo "para1 is $para1"
#将会输出 para1 is hello world
或者变量名两边添加大括号：
echo "para1 is ${para1}!"
#将会输出 para1 is hello world!
```

# 执行计算
```
在shell中执行命令通常只需要像在终端一样执行命令即可，不过，如果想要命令结果打印出来的时候，这样的方式就行不通了。因此，shell的命令方式常有：
a=`ls`#`是左上角～键，不是单引号
或者使用\$，后面括号内是执行的命令：
echo "current path is $(pwd)"#
另外，前面两种方式对于计算表达式也是行不通的，而要采取下面的方式：
echo "1+1=$((1+1))"#打印：1+1=2
即\$后面用两重括号将要计算的表达式包裹起来。
那如果要执行的命令存储在变量中呢？前面的方法都不可行了，当然括号内的内容被当成命令执行还是成立的。要使用下面的方式，例如：
a="ls"
echo "$($a)"
但是如果字符串时多条命令的时候，上面的方式又不可行了，而要采用下面的方式：
a="ls;pwd"
echo "$(eval $a)"
这是使用了eval，将a的内容都作为命令来执行。
```

# 条件语句
```
一般说明，如果命令执行成功，则其返回值为0，否则为非0，因此，可以通过下面的方式判断上条命令的执行结果：

if[ $?-eq 0]
then
echo "success"
elif[ $?-eq 1]
then
echo "failed,code is 1"
else
echo "other code"
fi


case语句使用方法如下：

name="aa"
case $name in
"aa")
echo "name is $name"
;;
"")
echo "name is empty"
;;
"bb")
echo "name is $name"
;;
*)
echo "other name"
;;
esac


初学者特别需要注意以下几点：

+[]前面要有空格，它里面是逻辑表达式
+ifelif后面要跟then，然后才是要执行的语句
+如果想打印上一条命令的执行结果，最好的做法是将$?赋给一个变量，因为一旦执行了一条命令$?的值就可能会变。
+case每个分支最后以两个分号结尾，最后是case反过来写，即esac。
多个条件如何使用呢，两种方式，方式一：
if[10-gt 5-o 10-gt 4];then
echo "10>5 or 10 >4"
fi
方式二：
if[10-gt 5]||[10-gt 4];then
echo "10>5 or 10 >4"
fi
其中-o或者||表示或。这里也有一些常见的条件判定。

总结如下：
-o or 或者，同||
-a and 与，同&&
! 非
整数判断：
-eq 两数是否相等
-ne 两数是否不等
-gt 前者是否大于后者（greater then）
-lt 前面是否小于后者（less than）
-ge 前者是否大于等于后者（greater then or equal）
-le 前者是否小于等于后者（less than or equal）

字符串判断str1 exp str2：
-z "$str1" str1是否为空字符串
-n "$str1" str1是否不是空字符串
"$str1" == "$str2" str1是否与str2相等
"$str1" != "$str2" str1是否与str2不等
"$str1" =~ "str2" str1是否包含str2
特别注意，字符串变量最好用引号引起来，因为一旦字符串中有空格，这个表达式就错了，有兴趣的可以尝试当str1="hello world"，而str2="hello"的时候进行比较。

文件目录判断：filename
-f $filename 是否为文件
-e $filename 是否存在
-d $filename 是否为目录
-s $filename 文件存在且不为空
! -s $filename 文件是否为空
```

# 循环
```
循环形式一，和Python的for in很像：
#遍历输出脚本的参数
for i in $@;do
echo $i
done


循环形式二，和C语言风格很像：
for((i =0; i <10; i++));do
echo $i
done


循环形式三：
for i in{1..5};do
echo "Welcome $i"
done


循环方式四：
while["$ans"!="yes"]
do
read -p "please input yes to exit loop:" ans
done
只有当输入yes时，循环才会退出。即条件满足时，就进行循环。

循环方式五：
ans=yes
until[ $ans !="yes"]
do
read -p "please input yes to exit loop:" ans
done
这里表示，只有当ans不是yes时，循环就终止。

循环方式六：
for i in{5..15..3};do
echo "number is $i"
done
每隔3打印一次，即打印5,8,11,14。
```

# 函数
```
定义函数方式如下：

myfunc()
{
echo "hello world $1"
}

或者：

function myfunc()
{
echo "hello world $1"
}


函数调用：
para1="shouwang"
myfunc $para1
```

# 函数返回值
```
通常函数的return返回值只支持0-255，因此想要获得返回值，可以通过下面的方式。
function myfunc(){
local myresult='some value'
echo $myresult
}
val=$(myfunc)#val的值为some value


通过return的方式适用于判断函数的执行是否成功：
function myfunc(){
#do something
return0
}
if myfunc;then
echo "success"
else
echo "failed"
fi
```

# 注释
```
shell通过#来注释一行内容，前面我们已经看到过了：
#!/bin/bash
# 这是一行注释
:'
这是
多行
注释
'
ls
:<<EOF
这也可以
达到
多行注释
的目的
EOF
```

# 运行时打印重定向
```
脚本执行后免不了要记录日志，最常用的方法就是重定向。以下面的脚本为例：

#!/bin/bash
#test.sh
lll #这个命令是没有的，因此会报错
date


方式一，将标准输出保存到文件中，打印标准错误：

./test.sh > log.dat


这种情况下，如果命令执行出错，错误将会打印到控制台。所以如果你在程序中调用，这样将不会讲错误信息保存在日志中。

方式二，标准输出和标准错误都保存到日志文件中：

./test.sh > log.dat 2>&1


2>&1的含义可以参考《如何理解linuxshell中的2>&1》

方式三，保存日志文件的同时，也输出到控制台：

./test.sh |tee log.dat
```

# 在外部执行
```
最常见的执行方式前面已经看到了：
./test.sh


其它执行方式：
sh test.sh #在子进程中执行
sh -x test.sh #会在终端打印执行到命令，适合调试
source test.sh #test.sh在父进程中执行
. test.sh #不需要赋予执行权限，临时执行
```

# 退出码的坑
```
很多时候我们需要获取脚本的执行结果，即退出状态，通常0表示执行成功，而非0表示失败。为了获得退出码，我们需要使用exit。例如：

#!/bin/bash
function myfun()
{
if[ $# -lt 2 ]
then
echo "para num error"
exit 1
fi
echo "ok"
exit 2
}
if[ $# -lt 1 ]
then
echo "para num error"
exit 1
fi
returnVal=`myfun aa`
echo "end shell"
exit 0


这里需要特别注意的一点是，使用
returnVal=`myfun aa`
这样的句子执行函数，即便函数里面有exit，它也不会退出脚本执行，而只是会退出该函数，
这是因为exit是退出当前进程，而这种方式执行函数,只是赋了一个值出来，相当于fork了一个子进程，因此不会退出当前脚本。
最终结果就会看到，无论你的函数参数是什么最后end shell都会打印。

./test.sh;echo $?
0

这里的0就是脚本的执行结果。
```



