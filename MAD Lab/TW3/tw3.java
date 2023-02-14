package com.example.calcu;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import org.w3c.dom.Text;

public class MainActivity extends AppCompatActivity {

    float a, b, c;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void handleAdd(View view) {
        EditText num1 = findViewById(R.id.num1);
        EditText num2 = findViewById(R.id.num2);
        TextView ans = findViewById(R.id.ans);

        a = Float.parseFloat(num1.getText().toString());
        b = Float.parseFloat(num2.getText().toString());
        c = a + b;
        ans.setText(" " + a + " + " + " " + b + "  = " + c);
    }

    public void handleSub(View view) {
        EditText num1 = findViewById(R.id.num1);
        EditText num2 = findViewById(R.id.num2);
        TextView ans = findViewById(R.id.ans);

        a = Float.parseFloat(num1.getText().toString());
        b = Float.parseFloat(num2.getText().toString());
        c = a - b;
        ans.setText(" " + a + " - " + " " + b + "  = " + c);

    }

    public void handleMul(View view) {
        EditText num1 = findViewById(R.id.num1);
        EditText num2 = findViewById(R.id.num2);
        TextView ans = findViewById(R.id.ans);

        a = Float.parseFloat(num1.getText().toString());
        b = Float.parseFloat(num2.getText().toString());
        c = a * b;
        ans.setText(" " + a + " * " + " " + b + "  = " + c);

    }

    public void handleDiv(View view) {
        EditText num1 = findViewById(R.id.num1);
        EditText num2 = findViewById(R.id.num2);
        TextView ans = findViewById(R.id.ans);

        a = Float.parseFloat(num1.getText().toString());
        b = Float.parseFloat(num2.getText().toString());
        c = a / b;
        ans.setText(" " + a + " / " + " " + b + "  = " + c);

    }

}