#include <stdio.h>
#define nul 1000
#define nodes 10
int no;
struct node
{
    int a[nodes][4];
} router[nodes];
void init(int r)
{
    int i;
    for (i = 1; i <= no; i++)
    {
        router[r].a[i][1] = i;
        router[r].a[i][2] = 999;
        router[r].a[i][3] = nul;
    }
    router[r].a[r][2] = 0;
    router[r].a[r][3] = r;
}
void inp(int r)
{
    int i;
    printf("\nEnter dist from the node %d to other nodes ", r);
    printf("\nPls enter 999 if there is no direct route\n");
    for (i = 1; i <= no; i++)
    {
        if (i != r)
        {
            printf("Enter dist to other node %d:", i);
            scanf("%d", &router[r].a[i][2]);
            router[r].a[i][3] = i;
        }
    }
}
void display(int r)
{
    int i, j;
    printf("\n\nThe routing table for node %d is as follows:", r);
    for (i = 1; i <= no; i++)
    {
        if (router[r].a[i][2] >= 999)
            printf("\n\t\t\t %d \t no link \t no hop", router[r].a[i][1]);
        else
            printf("\n\t\t\t %d \t %d  \t\t%d", router[r].a[i][1], router[r].a[i][2], router[r].a[i][3]);
    }
}

void dv_algo(int r)
{
    int i, j, z;
    for (i = 1; i <= no; i++)
    {
        if (router[r].a[i][2] != 999 && router[r].a[i][2] != 0)
        {
            for (j = 1; j <= no; j++)
            {
                z = router[r].a[i][2] + router[i].a[j][2];
                if (router[r].a[j][2] > z)
                {
                    router[r].a[j][2] = z;
                    router[r].a[j][3] = i;
                }
            }
        }
    }
}
int main()
{
    int i, j, x, y;
    char choice = 'y';
    printf("Enter the number of nodes:");
    scanf("%d", &no);
    for (i = 1; i <= no; i++)
    {
        init(i);
        inp(i);
    }
    printf("\nThe configuration of the nodes after initialization is as follows: ");
    for (i = 1; i <= no; i++)
        display(i);
    for (i = 1; i <= no; i++)
        dv_algo(i);
    printf("\nThe configuration of the nodes after computation of paths is as follows:");
    for (i = 1; i <= no; i++)
        display(i);

    while (choice != 'n')
    {
        printf("\nEnter the nodes btn which shortest path is to be found:\n");
        scanf("%d %d", &x, &y);
        printf("\nThe length of shortest path is %d", router[x].a[y][2]);
        printf("\n\nContinue? (y/n):");
        scanf("%s", &choice);
    }
}
