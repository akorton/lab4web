package ifmo.labs.lab4.api;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Objects;

@Entity
@Table(name="results")
public class Result {
    private @Id @GeneratedValue long id;
    private float x;
    private float y;
    private float r;
    private boolean result;

    private String name;

    public Result(){};

    public Result(float x, float y, float r, String name){
        this.x = x;
        this.y = y;
        this.r = r;
        this.result = computeResult(x, y, r);
        this.name = name;
    }

    private boolean computeResult(float x, float y, float r){
        return computeCircleResult(x, y, r) || computeSquareResult(x, y, r) || computeTriangleResult(x, y, r);
    }

    private boolean computeTriangleResult(float x, float y, float r){
        return x >= 0 && y <= 0 && y >= x - r / 2;
    }

    private boolean computeSquareResult(float x, float y, float r){
        return x <= 0 && y >= 0 && x >= -r && y <= r;
    }

    private boolean computeCircleResult(float x, float y, float r){
        return x >= 0 && y >= 0 && x*x+y*y <= r*r/4;
    }
    public void setId(long id) {
        this.id = id;
    }

    public void setR(float r) {
        this.r = r;
    }

    public void setY(float y) {
        this.y = y;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public float getX() {
        return x;
    }

    public float getR() {
        return r;
    }

    public boolean isResult() {
        return result;
    }

    public void setResult(boolean result) {
        this.result = result;
    }

    public long getId() {
        return id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Result result1 = (Result) o;
        return id == result1.id && Float.compare(result1.x, x) == 0 && Float.compare(result1.y, y) == 0 && Float.compare(result1.r, r) == 0 && result == result1.result && Objects.equals(name, result1.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, x, y, r, result, name);
    }

    @Override
    public String toString() {
        return "Result{" +
                "id=" + id +
                ", x=" + x +
                ", y=" + y +
                ", r=" + r +
                ", result=" + result +
                ", name='" + name + '\'' +
                '}';
    }
}
