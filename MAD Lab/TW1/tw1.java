package com.exampl

import androidx.appcompat.app.AppCompatActivity;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import java.util.*;
import java.sql.Array;

public class MainActivity extends AppCompatActivity {
    float font = 30;
    int r = 0, b = 0, g = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void fontChange(View view) {
        TextView helloTxt = findViewById(R.id.helloTxt);
        helloTxt.setTextSize(font);
        font++;
    }

    public void colorChange(View view) {
        TextView helloTxt = findViewById(R.id.helloTxt);

        int red[] = new int[] { 221, 66, 117, 230, 2, 210 };
        int green[] = new int[] { 66, 245, 232, 11, 26, 120 };
        int blue[] = new int[] { 245, 212, 9, 11, 41, 240 };
        helloTxt.setTextColor(Color.rgb(red[r], green[g], blue[b]));
        r++;
        b++;
        g++;
        System.out.println("R : " + r);
        if (r > 5) {
            r = 0;
            g = 0;
            b = 0;
        }
    }
}