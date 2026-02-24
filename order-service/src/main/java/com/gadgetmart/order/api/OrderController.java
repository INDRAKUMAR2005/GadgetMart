package com.gadgetmart.order.api;

import com.gadgetmart.order.dto.OrderRequest;
import com.gadgetmart.order.model.Order;
import com.gadgetmart.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.placeOrder(orderRequest);
    }

    @GetMapping
    public List<Order> getAllOrders(@RequestParam(required = false) String email) {
        if (email != null) {
            return orderService.getOrdersByUser(email);
        }
        return orderService.getAllOrders();
    }

    @GetMapping("/{orderNumber}")
    public Order getOrder(@PathVariable String orderNumber) {
        return orderService.getOrderByNumber(orderNumber);
    }

    @PatchMapping("/{orderNumber}/status")
    public Order updateStatus(@PathVariable String orderNumber, @RequestParam String status) {
        return orderService.updateOrderStatus(orderNumber, status);
    }
}
