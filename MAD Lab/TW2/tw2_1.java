package com.example.tw2;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

public class MainActivity2 extends AppCompatActivity {
    String name, usn, dept;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        TextView t1 = (TextView) findViewById(R.id.newName);
        TextView t2 = (TextView) findViewById(R.id.newUsn);
        TextView t3 = (TextView) findViewById(R.id.newDept);

        Intent i = getIntent();

        usn = i.getStringExtra("usn_key");
        name = i.getStringExtra("name_key");
        dept = i.getStringExtra("dept_key");

        t1.setText(name);
        t2.setText(usn);
        t3.setText(dept);
    }
}