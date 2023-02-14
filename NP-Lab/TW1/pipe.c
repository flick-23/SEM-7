#include <unistd.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/wait.h>
int main()
{
	int fd[2];
	char buffer[100];
	pipe(fd);
	pid_t p = fork();
	if (p > 0)
	{
		printf("Parent PID : %d\n", getpid());
		printf("Child PID : %d\n", p);
		printf("[+]Passing \'Hello\' to child.\n\n");
		write(fd[1], "Hello", 5);
	}
	else
	{
		printf("Child PID : %d\n", getpid());
		printf("Parent PID : %d\n", getppid());
		int n = read(fd[0], buffer, 100);
		printf("Child received the following data : %s\n", buffer);
	}
}